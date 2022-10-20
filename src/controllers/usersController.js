require("dotenv").config();
const path=require("path");
const {uploadToBucket,deleteFromBucket}=require("../services/AWS_S3");

const {
    getAllUsers,
    findUserByPk,
    findUserByEmail,
    searchUsersByEmail,
    createUser,
    updateUser,
    destroyUser
}=require("../repositories/usersRepository");

const bcryptjs=require("bcryptjs");
const usersController={
    getUsersList:async(req,res)=>{
        //El número de página al que se quiere acceder es indicado como query al final de la url.
        let {page}=req.query;
        //En caso que no haya sido indicado - req.page=undefenid -, se asigna por defecto la página 1. 
        if (!page) page=1;
        //Si el cliente definió la página que quiere consulta, pero el valor no se puede parsear, se devuelve el error.
        page=parseInt(page);
        if (isNaN(page)||page<0) return res.status(400).json({
            status:400,
            message:"That page does't exist",
        });
        page=parseInt(page);
        try{
            const results=await getAllUsers(5*(page-1));
            count=results.count;
            rows=results.rows;
            if (count==0) return res.status(404).json({
                status:404,
                message:'There is no user'
            });
            const maxPage=Math.ceil(count/5);
            if (maxPage<page) return res.status(404).json({
                status:404,
                message:"That page does't exist",
            });
            const previousPage=page==1?1:page-1;
            const nextPage=page==maxPage?page:page+1;
            return res.status(200).json({
                status:200,
                previouspage:`/api/v1/users?page=${previousPage}`,
                nextpage:`/api/v1/users?page=${nextPage}`,
                count,
                users:rows,
            });
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        };
    },
    searchUsersByEmail:async(req,res)=>{
        //El número de página al que se quiere acceder es indicado como query al final de la url.
        let {page,email}=req.query;
        console.log('req.query',req.query);
        // En caso que no haya ingresado un criterio de búsqueda entre los emails de los usuarios se devuele un error.
        if (!email||email.length==0) return res.status(400).json({
            status:400,
            message:"You have to include at least one letter",
        });
        //En caso que no haya sido indicado - req.query.page=undefenid -, se asigna por defecto la página 1. 
        if (!page) page=1;
        //Si el cliente definió la página que quiere consulta, pero el valor no se puede parsear, se devuelve el error.
        page=parseInt(page);
        if (isNaN(page)||page<0) return res.status(400).json({
            status:400,
            message:"That page does't exist",
        });
        page=parseInt(page);
        try{
            // Únicamente el usuario administrador puede buscar usuarios por email, a su vez, para la búsqueda se hace uso del operador "like", que permite especificar la condición que debiera cumplirse en la búsqued, se hace uso del comodín "%" para evitar búsquedas restrictivas. La condición de búsqueda es especificada como query de la petición. En el resultado de la búsqueda se proporionan los id de las transacciones en las que hayan involucrado los usuarios, en el caso de los usuarios compradores, y los id de los productos a la venta, en el caso de los usuarios vendedores. Con los respectivos id, pueden realizarse las correspondientes peticiones para conocer el detalle de una transacción y también el historial de venta de un producto.
            const results=await searchUsersByEmail(email,5*(page-1));
            count=results.count;
            rows=results.rows;
            if (count==0) return res.status(404).json({
                status:404,
                message:'There is no user with that search criteria'
            });
            const maxPage=Math.ceil(count/5);
            if (maxPage<page) return res.status(404).json({
                status:404,
                message:"That page does't exist",
            });
            const previousPage=page==1?1:page-1;
            const nextPage=page==maxPage?page:page+1;
            return res.status(200).json({
                status:200,
                previouspage:`/api/v1/users/search?email=${email}&page=${previousPage}`,
                nextpage:`/api/v1/users/search?email=${email}&page=${nextPage}`,
                count,
                users:rows,
            });
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        };
    },
    getUserDetail:async (req,res)=>{
        const {id}=req.params;
        const userInToken=req.user;
        try {
            // Se corroborra que exista el usuario sobre el que se aplica la petición GET
            const userInDB=await findUserByPk(id);
            if (!userInDB) return res.status(404).json({
                status:404,
                message:'There is no user whit this id'
            });
            // A menos que quien realice la petición sea el usuario administrador, se corroborra que coincida el usuario que realiza la petición y el usuario sobre el que se aplica la petición, 
            if (userInToken.id!==userInDB.id&&userInToken.Role.name!=="Admin") 
                return res.status(403).json({
                    status:403,
                    message:`${req.user.first_name}, you don't have permission to do it`,
            });
            return res.status(200).json({
            status:200,
            user: userInDB
            });  
        
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
    updateUser:async(req,res)=>{
        const {id}=req.params;
        let {body}=req;
        const userInToken=req.user;
        try {
            // Se corroborra que exista el usuario sobre el que se aplica la petición PUT
            const userInDB=await findUserByPk(id);
            if (!userInDB) return res.status(404).json({
                status:404,
                message:'There is no user whit this id'
            });
            // Se corroborra que coincida el usuario que realiza la petición y el usuario sobre el que se aplica la petición-
            if (userInToken.id!==userInDB.id) return res.status(403).json({
                    status:403,
                    message:`${req.user.first_name}, you don't have permission to do it`,
            });
            //El usuario que solicita actualizar su registro tiene la opción de cambiar su avatar; si lo hace, en el servidor de AWS, se reemplaza el viejo avatar por el que se envió en la petición, y en la DB, se realiza la actualización correspondiente en el campo "image" ; si no lo hace, continúa con el mismo avatar que arrastraba, sin modificaciones ni en AWS ni en la DB.
            if (req.files) {
                const bucket="ecommerce1287";
                const oldimage=userInDB.image
                const oldimageArray=oldimage.split(".com/");
                const oldKey=oldimageArray[1];
                await deleteFromBucket(bucket,oldKey);
                const {image}=req.files;
                const newKey=`user-img/user-${Date.now()}${path.extname(image.name)}`;
                await uploadToBucket(bucket,newKey,image);
                body.image=`https://ecommerce1287.s3.sa-east-1.amazonaws.com/${newKey}`;
            } else {
                body.image=userInDB.image;
            }
            body.password=bcryptjs.hashSync(body.password,10);
            const userUpdated=await updateUser(body,id)
            return res.status(200).json({
            status:200,
            message:'User updated',
            userUpdated
            });  
        
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
    deleteUser:async(req,res)=>{
        const {id}=req.params;
        const userInToken=req.user;
        try {
            // Se corroborra que exista el usuario sobre el que se aplica la petición DELETE
            const userInDB=await findUserByPk(id);
            if (!userInDB) return res.status(404).json({
                status:404,
                message:'There is no user whit this id'
            });
            // Se corroborra que coincida el usuario que realiza la petición y el usuario sobre el que se aplica la petición-
            if (userInToken.id!==userInDB.id) return res.status(403).json({
                    status:403,
                    message:`${req.user.first_name}, you don't have permission to do it`,
            });
            const {Buys,ProductsOnSale}=userInDB;
            if (Buys.length!==0) return res.status(400).json({
                status: 400,
                error:`${req.user.first_name}, you can't do it, you have made at least one buy`
            });
            if (ProductsOnSale.length!==0) return res.status(400).json({
                status: 400,
                error:`${req.user.first_name}, you can't do it, you have at least one product on sale`
            });
            await destroyUser(id)
            return res.status(200).json({
            status:200,
            message:'User deleted'
            });  
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
};

module.exports=usersController