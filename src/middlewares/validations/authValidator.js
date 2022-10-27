const { check} = require('express-validator');
const { validate } = require('../../util/validateHelper');
const { findUserByEmail} = require('../../repositories/usersRepository');
const path=require("path");
const validateRegister = [
    check('first_name','the first_name is required and it has to include at least three letters')
        .isString().isLength({min:3}),
    check('last_name','the last_name is required and it has to include at least three letters')
        .isString().isLength({min:3}),
    check('email')
        .isEmail().withMessage('The email has to be valid')
        .custom(async function (email) {
                const user=await findUserByEmail(email);
                if (user) throw new Error('That email already exits');  
        }),
    check('password','The password must have at least 6 characters, one lowercase letter, one uppercase letter, one number and one symbol')
        .isStrongPassword({minLength: 6,minLowercase: 1,minUppercase: 1,minNumbers: 1,minSymbols: 1,}),
    check('role_id','The role must be buyer or seller')
        .custom((role_id)=>{
            if (role_id==="")
                throw new Error();
            return true
        }),
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
//esta validación del login se realiza al efecto de evitar que los campos respectivos queden indefinidos, si así ocurriese, no podrían efectuarse las consultas a la DB para corroborrar las credenciales
validateLogin=[
    check('email')
        .isEmail().withMessage('The email has to be valid'),
    check('password','The password must have at least 6 characters, one lowercase letter, one uppercase letter, one number and one symbol')
        .isStrongPassword({minLength: 6,minLowercase: 1,minUppercase: 1,minNumbers: 1,minSymbols: 1,}),
    (req, res, next) => {validate(req,res,next)}
];
module.exports = {validateRegister,validateLogin}