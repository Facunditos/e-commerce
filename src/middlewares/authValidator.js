const { check} = require('express-validator');
const { validate } = require('../util/validateHelper');
const { findUserByEmail} = require('../repositories/usersRepository');
const path=require("path");
const validateRegister = [
    check('first_name','first_name is required and it has to include at least three letters')
        .isString().isLength({min:3}),
    check('last_name','last_name is required and it has to include at least three letters')
        .isString().isLength({min:3}),
    check('email')
        .isEmail().withMessage('email has to be valid')
        .custom(async function (email) {
                const user=await findUserByEmail(email);
                if (user) throw new Error('This email already exits');  
        }),
    check('password','Must have at least 6 characters, one lowercase letter, one uppercase letter, one number and one symbol')
        .isStrongPassword({minLength: 6,minLowercase: 1,minUppercase: 1,minNumbers: 1,minSymbols: 1,}),
    check('file')
        .custom((value,{req})=>{
            if (req.files) {
                const {file}=req.files;
                const fileExtension=path.extname(file.name);
                const acceptedExtensions=[".jpg",".jpeg",".png",".gif"];
                if (!acceptedExtensions.includes(fileExtension)) 
                    throw new Error ("The file's extension must be JPG, JPEG, PNG or GIF");
            };
            return true
        }),
    (req, res, next) => {validate(req,res,next)}
];
//esta validación del login se realiza al efecto de evitar que los campos respectivos queden indefinidos, si así ocurriese, no podrían efectuarse las consultas a la DB para corroborrar las credenciales
validateLogin=[
    check('email','You must choose a email')
        .exists(),
    check('password','You must choose a password')
        .exists(),
    (req, res, next) => {validate(req,res,next)}
];

const validateUpdate = [
    check('first_name','first_name is required and it has to include at least three letters')
        .isString().isLength({min:3}),
    check('last_name','last_name is required and it has to include at least three letters')
        .isString().isLength({min:3}),
    check('password','password has to include at least six characters, one lowercase letter, one uppercase letter and one number')
        .isStrongPassword({minLength: 6,minLowercase: 1,minUppercase: 1,minNumbers: 1,minSymbols: 0,}),
    (req, res, next) => {validate(req,res,next)}
];
module.exports = {validateRegister,validateLogin,validateUpdate}