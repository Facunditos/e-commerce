require("dotenv").config();

const {
    getAllCategories,
    searchCategoriesByName,
    findCategoryByPk,
    findCategoryByName,
    createCategory,
    updateCategory,
    destroyCategory
}=require("../repositories/categoriesRepository");

const categoriesController={
    getCategoriesList:async(req,res)=>{
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
            const results=await getAllCategories(5*(page-1));
            count=results.count;
            rows=results.rows;
            if (count==0) return res.status(404).json({
                status:404,
                message:'There is no category'
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
                previouspage:`/api/v1/categories?page=${previousPage}`,
                nextpage:`/api/v1/categories?page=${nextPage}`,
                count,
                users:rows,
            });
        } catch(error) {
            console.log(error);
            return res.status(500).json({
                status:500,
                message:'Server error'
            });
            
        };
    },
    searchCategoriesByName:async(req,res)=>{
        try {
            // Para la búsqueda se hace uso del operador "like", que permite especificar la condición que debiera cumplirse para que la búsqueda arroje un resultado, se hace uso del comodín "%" para evitar búsquedas restrictivas. La condición de búsqueda es especificada como query de la petición. En el resultado de la búsqueda se proporionan los id de los productos abarcados por cada categoría. Con los respectivos id, pueden realizarse las correspondientes peticiones para conocer el detalle de un producto.
            const {name}=req.query;
            const categories=await searchCategoriesByName(name);
            if (categories.length!==0) {
                return res.status(200).json({
                    status:200,
                    categories
                })
            } else {
                return res.status(404).json({
                    status:404,
                    message:'There are no category with this name'
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
    getCategoryDetail:async (req,res)=>{
        const {id}=req.params;
        try {
            // Se corroborra que exista la categoría sobra la que se aplica la petición GET
            const category=await findCategoryByPk(id);
            if (!category) return res.status(404).json({
                status:404,
                message:'There is no category whit this id'
            });
            return res.status(200).json({
            status:200,
            category
            });  
        
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
    createCategory:async(req,res)=>{
        const {body}=req;
        try{
            // En el caso que el valor de la descripción sea un string vacío, resulta necesario cambiar este valor a "undefinded" para que, por lo definido para este atributo en el modelo "Category", opere la propiedad "defaultValue"
            if (!body.description) {
                body.description=undefined;
            }
            const category=await createCategory(body);
            res.status(201).json({
                status:201,
                message:'Cstegory created',
                category
            })
        }catch(e){
            console.log(e);
            res.status(500).json({
                status:500,
                message:'Server error'
            })
        }
    },
    updateCategory:async(req,res)=>{
        const {body}=req;
        const {id}=req.params;
        try{
            // Se corroborra que exista la categoría sobre la que se aplica la petición PUT
            const category=await findCategoryByPk(id);
            if (!category) return res.status(404).json({
                status:404,
                message:'There is no category whit this id'
            });
            // En el caso que el valor de la descripción sea un string vacío, resulta necesario cambiar este valor a "undefinded" para que, por lo definido para este atributo en el modelo "Category", opere la propiedad "defaultValue"
            if (!body.description) {
                body.description="category without description";
            }
            const categoryUpdated=await updateCategory(body,id);
            res.status(201).json({
                status:201,
                message:'Category updated',
                categoryUpdated
            })
        }catch(e){
            console.log(e);
            res.status(500).json({
                status:500,
                message:'Server error'
            })
        }
    },
    deleteCategory:async(req,res)=>{
        const {id}=req.params;
        try {
            // Se corroborra que exista la categoría sobre la que se aplica la petición DELETE
            const category=await findCategoryByPk(id);
            if (!category) return res.status(404).json({
                status:404,
                message:'There is no category whit this id'
            });
            const {Products}=category;
            if (Products.length!==0) return res.status(400).json({
                status: 400,
                error:`${req.user.first_name}, you can't do it, this category has at least one product associated`
            });
            await destroyCategory(id)
            return res.status(200).json({
            status:200,
            message:'Category deleted'
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

module.exports=categoriesController