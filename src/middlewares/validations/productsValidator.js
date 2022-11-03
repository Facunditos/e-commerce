const path=require("path");
const { check} = require('express-validator');
const { validate } = require('../../util/validateHelper');

const validateCreate = [
    check('name',"The product's name is required and it has to include at least three letters")
        .isString().isLength({min:3}),
    check('price',"The product's price is required and it has to be a number greater than zero")
        .isFloat({min:1}),
    check('description',"If the the product's description is felled up, this has to include at least 120 characters")
        .if((value, { req }) => req.body.description)
        .isString().isLength({min:120}),       
    check('category_id',"The product's category is required")
        .notEmpty(),
    check('stock','The stock must be zero or greater than zero')
        .isInt({min:0}),
    check('status',"The product's status must be active or inactive")
        .isIn(['active','inactive']),
    check('image')
        .custom((value,{req})=>{
            const {files}=req;
            if (!files) throw new Error ("The product's image is necessary");
            const image=files.image
            const imageExtension=path.extname(image.name);
            const acceptedExtensions=[".jpg",".jpeg",".png",".gif"];
            if (!acceptedExtensions.includes(imageExtension)) 
                    throw new Error ("The image file extension must be JPG, JPEG, PNG or GIF");
            return true
        }),
    (req, res, next) => {validate(req,res,next)}
];

const validateUpdate = [
    check('name',"The product's name is required and it has to include at least three letters")
        .if((value, { req }) => req.body.name)
        .isString().isLength({min:3}),
    check('description',"If the the product's description is felled up, this has to include at least 120 characters")
        .if((value, { req }) => req.body.description)
        .isString().isLength({min:120}), 
    check('price',"The product's price is required and it has to be a number greater than zero")
        .if((value, { req }) => req.body.price)
        .isFloat({min:1}),
    check('category_id',"The product's category is required")
        .if((value, { req }) => req.body.category_id)
        .isInt({min:1}),
    check('stock','The stock must be zero or greater than zero')
        .if((value, { req }) => req.body.stock)
        .isInt({min:0}),
    check('status',"The product's status must be active or inactive")
        .if((value, { req }) => req.body.status)
        .isIn(['active','inactive']),
    check('image')
        .custom((value,{req})=>{
            if (req.files) {
                const image=req.files.image;
                const imageExtension=path.extname(image.name);
                const acceptedExtensions=[".jpg",".jpeg",".png",".gif"];
                if (!acceptedExtensions.includes(imageExtension)) 
                        throw new Error ("The image file extension must be JPG, JPEG, PNG or GIF");
            };
            return true
        }),
    (req, res, next) => {validate(req,res,next)}
];
module.exports = {validateCreate,validateUpdate}