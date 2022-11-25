require("dotenv").config();

const {
    getAllCategories,
    searchCategoriesByName,
    findCategoryByPk,
    findCategoryByName,
    createCategory,
    updateCategory,
    destroyCategory,
    restoreCategory
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
        const offset=5*(page-1)
        try{
            const results=await getAllCategories(offset);
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
                categories:rows,
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
        //El número de página al que se quiere acceder es indicado como query al final de la url.
        let {page,name}=req.query;
        if (!name||name.length==0) return res.status(400).json({
            status:400,
            message:"You have to include at least one letter to search categories",
        });
        //En caso que no haya sido indicado - req.page=undefenid -, se asigna por defecto la página 1. 
        if (!page) page=1;
        //Si el cliente definió la página que quiere consulta, pero el valor no se puede parsear, se devuelve el error.
        page=parseInt(page);
        if (isNaN(page)||page<0) return res.status(400).json({
            status:400,
            message:"That page does't exist",
        });
        page=parseInt(page);
        const offset=5*(page-1)
        try{
            const results=await searchCategoriesByName(name,offset);
            count=results.count;
            rows=results.rows;
            if (count==0) return res.status(404).json({
                status:404,
                message:'There is no category with that search criteria'
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
                categories:rows,
            });
        } catch(error) {
            console.log(error);
            return res.status(500).json({
                status:500,
                message:'Server error'
            });
            
        };
    },
    getCategoryDetail:async (req,res)=>{
        const {id}=req.params;
        try {
            // Se corroborra que exista la categoría sobra la que se aplica la petición GET
            const category=await findCategoryByPk(id);
            if (!category) return res.status(404).json({
                status:404,
                message:'There is no category whit that id'
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
            let category=await findCategoryByName(body.name);
            if (category) return res.status(400).json({
                status:400,
                errors:{
                    name:{
                        msg:'That category already exits',
                    },
                },
            }); 
            // En el caso que el valor de la descripción sea un string vacío, resulta necesario cambiar este valor a "undefinded" para que, por lo definido para este atributo en el modelo "Category", opere la propiedad "defaultValue"
            if (!body.description) {
                body.description=undefined;
            };
            category=await createCategory(body);
            return res.status(201).json({
                status:201,
                message:'Category created',
                category
            });
        }catch(error){
            
            // Como está implementado el soft delete se hace necesario contemplar la posibilidad la categoría que quiere crearse ya se encuentre en la base de datos, en este caso corresponde cambiar a null el valor del atributo deletedAt para esa categoría 
            if (error.name==='SequelizeUniqueConstraintError') {
                await restoreCategory(body.name);
                let restoredCategory=await findCategoryByName(body.name);
                if (!body.description) {
                    body.description="This category doesn't have a description";
                };
                restoredCategory=await updateCategory(restoredCategory,body);
                return res.status(201).json({
                status:201,
                message:'Category restored',
                restoredCategory
                });
            }else{
               console.log(error);
            return res.status(500).json({
                status:500,
                message:'Server error'
            }); 
            };
        };
    },
    updateCategory:async(req,res)=>{
        const {body}=req;
        const {id}=req.params;
        try{
            let category=await findCategoryByPk(id);
            // Se corroborra que exista el categoryo sobre el que se aplica la petición PUT
            if (!category) return res.status(404).json({
                status:404,
                message:'There is no product whit that id'
            }); 
            // En el caso que el valor de la descripción sea un string vacío, resulta necesario cambiar este valor a "undefinded" para que, por lo definido para este atributo en el modelo "Category", opere la propiedad "defaultValue
            if (!body.description) {
                body.description="This category doesn't have a description";
            };
            category=await updateCategory(category,body);
            return res.status(200).json({
                status:200,
                message:'Category updated',
                category
            })
        }catch(error){
            if (error.name==='SequelizeUniqueConstraintError') return res.status(400).json({
                status:400,
                errors:{
                    name:{
                        msg:'That category already exits',
                    },
                },
            })
            console.log(error);
            return res.status(500).json({
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
                message:'There is no category whit that id'
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