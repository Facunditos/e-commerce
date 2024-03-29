require("dotenv").config();
const {
    getAllProductsOrderBySales,
    searchProductsByNameAndOrder,
    findProductByPk,
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
            message:"That page does't exist",
        });
        const offset=(page-1)*5;
        try{
            //La clave count almacena la cantidad total de registros que integran la tabla de productos. La clase rows almacena el array de products que se quieren mostrar según la query, la cual tiene incluida las propiedades "limit" y "offset". A su vez, se ordena la búsqueda, primero, según categoría, y luego, según las ventas acumuladas (precio * cantidad) de cada producto.

            const {count,rows}=await getAllProductsOrderBySales(offset);
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
                previouspage:`/api/v1/products?page=${previousPage}`,
                nextpage:`/api/v1/products?page=${nextPage}`,
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
        let {name,orderBy,order,page}=req.query;
        if (!name||name.length==0) return res.status(400).json({
            status:400,
            message:"You have to include at least one letter to search products",
        });
        if (!page) page=1;
        page=parseInt(page);
        if (isNaN(page)||page<0) return res.status(400).json({
            status:400,
            message:"That page does't exist",
        });
        if (orderBy==='undefined') orderBy=undefined;
        if (order==='undefined') order=undefined;
        const attributes=['sales','price'];
        const orderList=['asc','desc','ASC','DESC']
        if (orderBy&&!attributes.includes(orderBy)) return res.status(400).json({
            status:400,
            message:'The products search can only be sorted by name or price'
        });
        if (order&&!orderList.includes(order)) return res.status(400).json({
            status:400,
            message:'The products search can only be sorted ascendantly or descendingly'
        });
        const offset=(page-1)*5;
        try {
            const {count,rows}=await searchProductsByNameAndOrder(name,orderBy,order,offset);
            if (count==0) return res.status(404).json({
                status:404,
                message:'There is no products whit that name'
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
                previouspage:`/api/v1/products/search?name=${name}&page=${previousPage}&order=${order}&orderBy=${orderBy}`,
                nextpage:`/api/v1/products/search?name=${name}&page=${nextPage}&order=${order}&orderBy=${orderBy}`,
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
        try {
            // Se corroborra que exista el producto sobra el que se aplica la petición GET
            const product=await findProductByPk(id);
            if (!product) return res.status(404).json({
                status:404,
                message:'There is no product whit that id'
            });
            if (product.status==='inactive') return res.status(400).json({
                status:400,
                message:'That product is not on sale'
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
};

module.exports=productsController