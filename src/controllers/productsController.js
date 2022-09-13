require("dotenv").config();

const {
    getAllProducts,
    findProductByPk,
    createProduct,
    updateProduct,
    destroyProduct
}=require("../repositories/productsRepository");

const productsController={
    getProductsList:async(req,res)=>{
        //El número de página al que se quiere acceder es indicado como query al final de la url.
        let {page}=req.query;
        //En caso que no haya sido indicado - req.page=undefenid -, se asigna por defecto la página 1. 
        if (!page) page=1;
        //Si el cliente definió la página que quiere consulta, pero el valor no se puede parsear, se devuelve el error.
        page=parseInt(page);
        if (isNaN(page)||page<0) return res.status(400).json({
            status:400,
            message:"Page does't exist",
        });
        page=parseInt(page);
        try{
            //La clave count almacena la cantidad total de registros que integran la tabla de productos. La clase rows almacena el array de products que se quieren mostrar según la query, la cual tiene las propiedades "limit" y "offset". 
            const {count,rows}=
            if (rows.length==0) return res.status(404).json({
                status:404,
                message:"There is no transaction",
            });
            //En base a considerar que se quiere devolver cinco registros, se indica la máxima página que corresponde en base a la cantidad de transacciones encontradas. 
            const maxPage=Math.ceil(count/5);
            if (maxPage<page) return res.status(400).json({
                status:400,
                message:"Page does't exist",
            });
            if (count==0) return res.status(404).json({
                status:404,
                message:'There is no transaction'
            });
            const previousPage=page==1?1:page-1;
            const nextPage=page==maxPage?page:page+1;
            return res.status(200).json({
                status:200,
                previouspage:`/me/transactions?page=${previousPage}`,
                nextpage:`/me/transactions?page=${nextPage}`,
                transactions:rows,
            });
            //return res.render("transactions",{transactions,sellersGroupedByTransaction,productsCategoriesGroupedByTransaction})

        } catch(error) {
            console.log(error);
            return res.status(500).json({
                status:500,
                message:'Server error'
            });
            
        };
    },
    searchProductsByName:async(req,res)=>{
        try {
            // Únicamente el usuario administrador puede buscar categorías por nombre, a su vez, para la búsqueda se hace uso del operador "like", que permite especificar la condición que debiera cumplirse en la búsqued, se hace uso del comodín "%" para evitar búsquedas restrictivas. La condición de búsqueda es especificada como query de la petición. En el resultado de la búsqueda se proporionan los id de los productos abarcados por cada categoría. Con los respectivos id, pueden realizarse las correspondientes peticiones para conocer el detalle de un producto.
            const {name}=req.query;
            const products=await searchProductsByName(name);
            if (products.length!=0) {
                return res.status(200).json({
                    status:200,
                    products
                })
            } else {
                return res.status(404).json({
                    status:404,
                    message:'There are no product with this name'
                }) 
            }
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
    getProductDetail:async (req,res)=>{
        const {id}=req.params;
        try {
            // Se corroborra que exista la categoría sobra la que se aplica la petición GET
            const product=await findProductByPk(id);
            if (!product) return res.status(404).json({
                status:404,
                message:'There is no product whit this id'
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
        const {body}=req;
        try{
            // En el caso que el valor de la descripción sea un string vacío, resulta necesario cambiar este valor a "undefinded" para que, por lo definido para este atributo en el modelo "Product", opere la propiedad "defaultValue"
            if (!body.description) {
                body.description=undefined;
            }
            const product=await createProduct(body);
            res.status(201).json({
                status:201,
                message:'Cstegory created',
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
        const {body}=req;
        const {id}=req.params;
        try{
            // Se corroborra que exista la categoría sobre la que se aplica la petición PUT
            const product=await findProductByPk(id);
            if (!product) return res.status(404).json({
                status:404,
                message:'There is no product whit this id'
            });
            // En el caso que el valor de la descripción sea un string vacío, resulta necesario cambiar este valor a "undefinded" para que, por lo definido para este atributo en el modelo "Product", opere la propiedad "defaultValue"
            if (!body.description) {
                body.description="product without description";
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
        try {
            // Se corroborra que exista la categoría sobre la que se aplica la petición DELETE
            const product=await findProductByPk(id);
            if (!product) return res.status(404).json({
                status:404,
                message:'There is no product whit this id'
            });
            const {Products}=product;
            if (Products.length!=0) return res.status(400).json({
                status: 400,
                error:`${req.user.first_name}, you can't do it, this product has at least one product associated`
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

module.exports=productsController