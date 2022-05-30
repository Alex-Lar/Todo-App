const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const todoRoutes = require('./routes/todos');
const PORT = process.env.PORT || 3000;

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(todoRoutes);

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    
    if (!err.message) {
        err.message = 'Something Went Wrong!';
    }

    console.log(err);
    res.status(statusCode).render('error');
});

async function start() {
    try {
        await mongoose.connect('mongodb://localhost:27017/todo-app').then(() => console.log('Database connected...'));
        app.listen(PORT, () => {
            console.log('Server has been started...');
        });
    } catch (e) {
        console.log('ERROR');
        console.log(e);
    }
}

start();