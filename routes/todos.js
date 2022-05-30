const { Router } = require('express');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { todoSchema } = require('../validators/schemas');
const Todo = require('../models/todos');
const router = Router();


const validateTodo = (req, res, next) => {
    const { error } = todoSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get('/', function (req, res) {
    Todo.find({}).then(todos => {
        res.render('index.hbs', {
            title: 'Your Todos',
            isIndex: true,
            todos: todos.map(todo => todo.toJSON())
        });
    });
});

router.get('/create', (req, res) => {
    res.render('create', {
        title: 'New Todo',
        isCreate: true
    });
});

router.post('/create', validateTodo, catchAsync(async (req, res) => {
    const { title } = req.body;
    const todo = new Todo({title});
    await todo.save();
    res.redirect('/');
}));

router.post('/complete', catchAsync(async (req, res) => {
    const { id, completed } = req.body;
    const todo = await Todo.findById(id);
    todo.completed = !!completed;
    await todo.save();

    res.redirect('/');
}));

router.delete('/delete', catchAsync(async (req, res) => {
    const { id } = req.body;
    await Todo.findByIdAndDelete(id);
    res.redirect('/');
}));

router.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});


module.exports = router;