/* "If the category's description is given it must have at least ten letters" */
const { check} = require('express-validator');
const { validate } = require('../util/validateHelper');

const {findCategoryByName}=require("../repositories/categoriesRepository");

const validateCreate = [
    check('name',"The category's name  is required and it has to include at least three letters")
        .isString().isLength({min:3})
        .custom(async function (name) {
                const category=await findCategoryByName(name);
                if (category) throw new Error('This category already exits');  
        }),
    check('description')
        .custom((description)=>{
            if (description && typeof description!=="string") {
                throw new Error("The category description must be a text")
            }
            return true
        }),
    (req, res, next) => {validate(req,res,next)}
];

const validateUpdate = [
    check('name',"The category's name  is required and it has to include at least three letters")
        .isString().isLength({min:3}),
    check('description')
        .custom((description)=>{
            if (description && typeof description!=="string") {
                throw new Error("The category description must be a text")
            }
            return true
        }),
    (req, res, next) => {validate(req,res,next)}
];
module.exports = {validateCreate,validateUpdate}