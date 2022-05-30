const Joi = require('joi');

module.exports.todoSchema = Joi.object({
    title: Joi.string().required()
});