const path=require("path");
const { check} = require('express-validator');
const { validate } = require('../util/validateHelper');
const {findCategoryByPk}=require("../repositories/categoriesRepository");
const {findProductByName, findProductByPk}=require("../repositories/productsRepository");

const validateCreate = [
    check('name',"The product's name is required and it has to include at least three letters")
        .isString().isLength({min:3})
        .custom(async function (name) {
                const product=await findProductByName(name);
                if (product) throw new Error('This product already exits');  
        }),
    check('price',"The product's price is required and it has to be a numbe greater than zero")
        .isFloat({min:1}),
    check('category_id',"The product's category is required")
        .notEmpty()
        .custom(async(category_id)=>{
            const category_idAsNumber=parseInt(category_id);
            const productCategory=await findCategoryByPk(category_idAsNumber);
            if (productCategory==null)
                throw new Error("The product's category doesn't exit");
            return true
    }),
    check('stock','The stock must be zero or greater than zero')
        .isInt({min:0}),
    check('status',"The product's status must be active or inactive")
        .isIn(['active','inactive']),
    check('file')
        .custom((value,{req})=>{
            const {files}=req;
            if (!files) throw new Error ("The product's image is necessary");
            const image=files.file;
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
        .isString().isLength({min:3})
        .custom(async function (name,{req}) {
            const {id}=req.params
            const productInDB=await findProductByPk(id);
            if (!productInDB) return res.status(404).json({
                status:404,
                message:'There is no product whit this id'
            });
            if (productInDB.name!==req.body.name) {
                const product=await findProductByName(name);
                if (product) throw new Error('This product already exits');  
            };
        }),
    check('price',"The product's price is required and it has to be a numbe greater than zero")
        .isFloat({min:1}),
    check('category_id',"The product's category is required")
        .isInt({min:1})
        .custom(async(category_id)=>{
            const category_idAsNumber=parseInt(category_id);
            const productCategory=await findCategoryByPk(category_idAsNumber);
            if (productCategory==null)
                throw new Error("The product's category doesn't exit");
            return true
    }),
    check('stock','The stock must be zero or greater than zero')
        .isInt({min:0}),
    check('status',"The product's status must be active or inactive")
        .isIn(['active','inactive']),
    check('file')
        .custom((value,{req})=>{
            if (req.files) {
                console.log('lepra');
                const image=req.files.file;
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