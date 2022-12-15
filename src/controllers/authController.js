require("dotenv").config();

const {uploadToBucket}=require("../services/AWS_S3");
const sendWelcomeEmail=require("../services/sendgridEmail");

const {
    getAllUsers,
    findUserByPk,
    findUserByEmail,
    createUser,
    updateUser,
    destroyUser,
    restoreUser,
}=require("../repositories/usersRepository");
const {deleteFromBucket}=require("../services/AWS_S3")

const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");
const path=require("path");

const authController={
    registerUser:async(req,res)=>{
        const {body}=req;
        const bucket="ecommerce1287";
        //Aquellos usuarios que tienen el rol como administrador, deben ser incluidos en la lista de usuarios administradores, pues para asignarle este rol, se consulta si el usuario forma parte de esta lista, en caso que así sea se cambia el valor de la propiedad "role_id" que viene del body por el número  el número 1 -se definió en la tabla roles que el id 1 es el que corresponde para el usuario administrador-. 
        const adminUsers=["ecommerce1287@gmail.com"];
        try {
            const user=await findUserByEmail(body.email);
            if (user) return res.status(400).json({
                status:400,
                errors:{
                    email:{
                        msg:'That email already exits',
                    },
                },
            });
            //En el caso que el usuario decida subir una imagen como avatar, ésta se almacena en el bucket de Amazon. Si no sube ninguna imagen, se le asigna el avatar anónimo.
            if (req.files) {
                const {image}=req.files;
                const key=`user-img/user-${Date.now()}${path.extname(image.name)}`;
                await uploadToBucket(bucket,key,image);
                body.image=`https://ecommerce1287.s3.sa-east-1.amazonaws.com/${key}`;
            };
            body.password=bcryptjs.hashSync(body.password,10);
            if (adminUsers.includes(body.email)) body.role_id=1;
            const newUser=await createUser(body);
            await sendWelcomeEmail(newUser.email,newUser.first_name);
            return res.status(201).json({
                status:201,
                message:'User created',
                newUser
            });
        } catch(error) {
            // Como está implementado el soft delete se hace necesario contemplar la posibilidad de que el usuario que se registra ya se encuentre en la base de datos, en este caso corresponde cambiar a null el valor del atributo deletedAt 
            if (error.name==='SequelizeUniqueConstraintError') {
                await restoreUser(body.email);   
                let restoredUser=await findUserByEmail(body.email);
                const defaultUserImage="https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/user-anonymous.png";
                if (restoredUser.image!==defaultUserImage) {
                    const oldimage=restoredUser.image;
                    const oldimageArray=oldimage.split(".com/");
                    const oldKey=oldimageArray[1];
                    await deleteFromBucket(bucket,oldKey);
                };
                if (!body.image) body.image="https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/user-anonymous.png";
                restoredUser=await updateUser(restoredUser,body);
                return res.status(201).json({
                status:201,
                message:'User restored and updated',
                restoredUser,
                });
            } else {            
                console.log(error);
                return res.status(500).json({
                status:500,
                message:'Server error'
                });
            };
        };
    },
    loginUser:async(req,res)=>{
        const {email,password}=req.body;
        try {    
            const user=await findUserByEmail(email);
            if (!user) return res.status(404).json({
                status:404,
                errors:{
                    email:{
                        msg:"There is a mistake in your email. You have to create an account if you haven't done it",
                    },
                },
            });
            const hashPassword=user.password;
            const isRightPassword=bcryptjs.compareSync(password,hashPassword);
            if (!isRightPassword) return res.status(404).json({
                status:404,
                errors:{
                    password:{
                        msg:'There is a mistake in your password',
                    },
                },
            });
            const payload=user.id;
            const token=jwt.sign(
                {payload},
                process.env.JWT_PRIVATE_KEY,
                {
                  expiresIn: "8h",
                },
            );
            return res.status(200).json({
                status:200,
                message:'User logged in',
                user,
                token
            })
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error',
            })
            
        }
    },
};

module.exports=authController