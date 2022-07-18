const { check} = require('express-validator');
const { validate } = require('../util/validateHelper');
const { findByEmail } = require('../repositories/usersRepository');

const validateRegister = [
    check('first_name','first_name is required and it has to include at least three letters')
        .isString().isLength({min:3}),
    check('last_name','last_name is required and it has to include at least three letters')
        .isString().isLength({min:3}),
    check('email')
        .isEmail().withMessage('email has to be valid')
        .custom(async function (email) {
                const user=await findByEmail(email);
                if (user) throw new Error('This email already exits');
                console.log('vamos');
                
        }),
    check('password','password has to include at least six characters, one lowercase letter, one uppercase letter and one number')
        .isStrongPassword({minLength: 6,minLowercase: 1,minUppercase: 1,minNumbers: 1,minSymbols: 0,}),
    (req, res, next) => {validate(req,res,next)}
];
//esta validación del login se realiza al efecto de evitar que los campos respectivos queden indefinidos, si así ocurriese no podrían efectuarse las consultas a la DB para corroborrar las credenciales
validateLogin=[
    check('email')
        .exists(),
    check('password')
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