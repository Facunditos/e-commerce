require("dotenv").config();
const {
    getAllProductsOrderBySales,
    searchProductsByNameAndOrder,
    findProductByPk,
    createProduct,
    updateProduct,
    destroyProduct,
}=require("../repositories/productsRepository");
const {uploadToBucket,deleteFromBucket}=require("../services/AWS_S3");
const path=require("path");
const meProductsController={
    getProductsList:async(req,res)=>{
        //Si el usuario que realiza la petición es Admin y no incluye el id del usuario vendedor se retorna un error
        if (req.user.role_name==='Admin'&&!req.query.sellerId){
            return res.status(400).json({
                status:400,
                message:'Admin, you have to include a seller id as query'
            });
        };
        // El id del usuario vendedor puede venir: (a) en la propiedad "user" adosada a la request al momento de la verificación del token, para el caso del usuario vendedor; o (b) como query string, para el caso del usuario admin. 
        const sellerId=req.user.role_name==='Seller'?req.user.id:req.query.sellerId;
        console.log("sellerId",sellerId);
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
        const offset=(page-1)*5;
        try{
            //La clave count almacena la cantidad total de registros que integran la tabla de productos. La clase rows almacena el array de products que se quieren mostrar según la query, la cual tiene incluida las propiedades "limit" y "offset". A su vez, se ordena la búsqueda, primero, según categoría, y luego, según las ventas acumuladas (precio * cantidad) de cada producto.
            const {count,rows}=await getAllProductsOrderBySales(offset,sellerId);
            if (count==0) return res.status(404).json({
                status:404,
                message:'There is no product'
            });
            //En base a considerar que se quiere devolver cinco registros, se indica la máxima página que corresponde según la cantidad de transacciones encontradas. 
            const maxPage=Math.ceil(count/5);
            if (maxPage<page) return res.status(404).json({
                status:404,
                message:"That page does't exist",
            });
            const previousPage=page==1?1:page-1;
            const nextPage=page==maxPage?page:page+1;
            return res.status(200).json({
                status:200,
                previouspage:`/products?page=${previousPage}`,
                nextpage:`/products?page=${nextPage}`,
                count,
                products:rows,
            });
        } catch(error) {
            console.log(error);
            return res.status(500).json({
                status:500,
                message:'Server error'
            });
            
        };
    },
    searchProductsByName:async(req,res)=>{
        // Para la búsqueda se hace uso del operador "like", que permite especificar la condición que debiera cumplirse para que se arroje un resultado, se hace uso del comodín "%" para evitar búsquedas restrictivas. La condición de búsqueda es especificada como query de la petición. En el resultado de la búsqueda se proporionan los id de los productos abarcados por cada categoría. Con los respectivos id, pueden realizarse las correspondientes peticiones para conocer el detalle de un producto.
        let {user}=req;
        const sellerId=user.id
        let {name,orderByAttribute,direction,page}=req.query;
        if (!page) page=1;
        page=parseInt(page);
        if (isNaN(page)||page<0) return res.status(400).json({
            status:400,
            message:"That page does't exist",
        });
        const attributes=['name','price'];
        const directionsList=['asc','desc','ASC','DESC']
        if (orderByAttribute&&!attributes.includes(orderByAttribute)) {
            return res.status(400).json({
            status:400,
            message:'The products search can only be sorted by name or price'
            })
        }
        if (direction&&!directionsList.includes(direction)) res.status(400).json({
            status:400,
            message:'The products search can only be sorted ascendantly or descendingly'
        });
        const offset=(page-1)*5;
        try {
            const {count,rows}=await searchProductsByNameAndOrder(name,orderByAttribute,direction,offset,sellerId);
            if (count==0) return res.status(404).json({
                status:404,
                message:'There is no products whit with that search criteria'
            });
            //En base a considerar que se quiere devolver cinco registros, se indica la máxima página que corresponde según la cantidad de transacciones encontradas. 
            const maxPage=Math.ceil(count/5);
            if (maxPage<page) return res.status(404).json({
                status:404,
                message:"That page does't exist",
            });
            const previousPage=page==1?1:page-1;
            const nextPage=page==maxPage?page:page+1;
            return res.status(200).json({
                status:200,
                previouspage:`/products?page=${previousPage}`,
                nextpage:`/products?page=${nextPage}`,
                count,
                products:rows,
            });
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        };
    },
    getProductDetail:async (req,res)=>{
        const {id}=req.params;
        const userInToken=req.user;
        try {
            // Se corroborra que exista la categoría sobra la que se aplica la petición GET
            const product=await findProductByPk(id);
            if (userInToken.Role.name=="Seller"&&userInToken.id!==product.seller_user_id) return res.status(403).json({
                status:403,
                message:`${userInToken.first_name}, you don't have permission to do it`,
            });
            if (!product) return res.status(404).json({
                status:404,
                message:'There is no product whit that id'
            });
            return res.status(200).json({
            status:200,
            product
            });  
        
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
    createProduct:async(req,res)=>{
        const {body,user,files}=req;
        body.seller_user_id=user.id;
        const fileUpload=files.file;
        const bucket="ecommerce1287";
        const key=`product-img/product-${Date.now()}${path.extname(fileUpload.name)}`;
        body.image=`https://ecommerce1287.s3.sa-east-1.amazonaws.com/${key}`;
        // En el caso que el valor de la descripción sea un string vacío, resulta necesario cambiar este valor a "undefinded" para que, por lo definido para este atributo en el modelo "Product", opere la propiedad "defaultValue"
        if (!body.description) body.description=undefined;
        try{
            await uploadToBucket(bucket,key,fileUpload);
            const product=await createProduct(body);
            res.status(201).json({
                status:201,
                message:'Product created',
                product
            })
        }catch(e){
            console.log(e);
            res.status(500).json({
                status:500,
                message:'Server error'
            })
        }
    },
    updateProduct:async(req,res)=>{
        const {body,user}=req;
        const {id}=req.params;
        const userInToken=user;
        try{
            const product=await findProductByPk(id);
            // Se corroborra que el usuario vendedor que realiza la petición sea el propietario del producto que se está editando-
            if (userInToken.id!==product.seller_user_id) return res.status(403).json({
                    status:403,
                    message:`${userInToken.first_name}, you don't have permission to do it`,
            });
            // Se corroborra que exista el producto sobre el que se aplica la petición PUT
            if (!product) return res.status(404).json({
                status:404,
                message:'There is no product whit that id'
            });     
            // En el caso que el valor de la descripción sea un string vacío, resulta necesario cambiar este valor a "undefinded" para que, por lo definido para este atributo en el modelo "Product", opere la propiedad "defaultValue"
            if (!body.description) {
                body.description="producto sin descripción";
            };
            //El usuario que solicita actualizar el producto tiene la opción de cambiar la foto del producto; si lo hace, en el servidor de AWS, se reemplaza la vieja foto por la que se envió en la petición; y en la DB, se realiza la actualización correspondiente en el campo "image" ; si no lo hace, continúa con la misma foto que arrastraba, sin modificaciones ni en AWS ni en la DB.
            if (req.files) {
                const bucket="ecommerce1287";
                const oldimage=product.image
                const oldimageArray=oldimage.split(".com/");
                const oldKey=oldimageArray[1];
                await deleteFromBucket(bucket,oldKey);
                const {file}=req.files;
                const newKey=`product-img/product-${Date.now()}${path.extname(file.name)}`;
                await uploadToBucket(bucket,newKey,file);
                body.image=`https://ecommerce1287.s3.sa-east-1.amazonaws.com/${newKey}`;
            } else {
                body.image=product.image;
            }
            const productUpdated=await updateProduct(body,id);
            res.status(201).json({
                status:201,
                message:'Product updated',
                productUpdated
            })
        }catch(e){
            console.log(e);
            res.status(500).json({
                status:500,
                message:'Server error'
            })
        }
    },
    deleteProduct:async(req,res)=>{
        const {id}=req.params;
        const userInToken=req.user;
        try {
            const product=await findProductByPk(id);
            // Se corroborra que el usuario vendedor que realiza la petición sea el propietario del producto que se prende eliminar-
            if (userInToken.id!==product.seller_user_id) return res.status(403).json({
                status:403,
                message:`${userInToken.first_name}, you don't have permission to do it`,
            });
            // Se corroborra que exista el producto sobre la que se aplica la petición DELETE
            if (!product) return res.status(404).json({
                status:404,
                message:'There is no product whit that id'
            });
            const {Transactions}=product;
            if (Transactions.length!==0) return res.status(400).json({
                status: 400,
                error:`${userInToken.first_name}, you can't do it, this product has at least one transaction associated`
            });
            await destroyProduct(id)
            return res.status(200).json({
            status:200,
            message:'Product deleted'
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

module.exports=meProductsController;