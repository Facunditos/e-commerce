const { check} = require('express-validator');
const { validate } = require('../../util/validateHelper');

const validateSetQuantity = [
    check('quantity','quantity is required and it has to be greater than zero')
        .isInt({min:1}),
    (req, res, next) => {validate(req,res,next)}
];
module.exports =validateSetQuantity