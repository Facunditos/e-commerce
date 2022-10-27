const { check} = require('express-validator');
const { validate } = require('../../util/validateHelper');
require("dotenv").config();

const {findUserByEmail}=require("../../repositories/usersRepository");
const path=require("path");

const validateUpdate = [
    check('first_name','The first_name is required and it has to include at least three letters')
        .isString().isLength({min:3}),
    check('last_name','The last_name is required and it has to include at least three letters')
        .isString().isLength({min:3}),
    check('email')
        .isEmail().withMessage('The email has to be valid')
        .custom(async function (email,{req}) {
                if (req.user.email!==req.body.email) {
                    const user=await findUserByEmail(email);
                    if (user) throw new Error('This email already exits');  
                };
                return true
        }),
    check('password','The password has to include at least six characters, one lowercase letter, one uppercase letter and one number')
        .isStrongPassword({minLength: 6,minLowercase: 1,minUppercase: 1,minNumbers: 1,minSymbols: 1,}),
    check('image')
        .custom((value,{req})=>{
            if (req.files) {
                const {image}=req.files;
                const fileExtension=path.extname(image.name);
                const acceptedExtensions=[".jpg",".jpeg",".png",".gif"];
                if (!acceptedExtensions.includes(fileExtension)) 
                    throw new Error ("The image's extension must be JPG, JPEG, PNG or GIF");
            };
            return true
        }),
    (req, res, next) => {validate(req,res,next)}
];
module.exports = {validateUpdate}