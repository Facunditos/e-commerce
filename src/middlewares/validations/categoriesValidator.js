/* "If the category's description is given it must have at least ten letters" */
const { check} = require('express-validator');
const { validate } = require('../../util/validateHelper');

const validateCreate = [
    check('name',"The category's name  is required and it has to include at least three letters")
        .isString().isLength({min:3}),
    check('description',"If the the category's description is felled up, this has to include at least 120 characters")
        .if((value, { req }) => req.body.description)
        .isString().isLength({min:120}),
    (req, res, next) => {validate(req,res,next)}
];

const validateUpdate = [
    check('name',"The category's name  is required and it has to include at least three letters")
        .if((value, { req }) => req.body.name)    
        .isString().isLength({min:3}),
    check('description',"If the the category's description is felled up, this has to include at least 120 characters")
        .if((value, { req }) => req.body.description)
        .isString().isLength({min:120}),
    (req, res, next) => {validate(req,res,next)}
];
module.exports = {validateCreate,validateUpdate}