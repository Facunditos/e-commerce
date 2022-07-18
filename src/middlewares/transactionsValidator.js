const { check} = require('express-validator');
const { validate } = require('../util/validateHelper');

const validateTransaction = [
    check('first_product_id','you have to buy at least one product')
        .notEmpty(),
    check('first_product_quantity','you have to buy at least one unit')
        .isFloat({min:1}),
    (req, res, next) => {validate(req,res,next)}
];
module.exports = {validateTransaction}