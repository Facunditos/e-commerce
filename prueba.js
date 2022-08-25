const {Product,User}=require("../database/models/index");
    async function updateProduct(body,id) {
        let product=await Product.update({
            name:body.name,
            description:body.description,
            price:body.price,
            category_id:body.category_id,
            stock:body.stock,
            status:body.status,
            image_url:body.image_url,
        },{
            where:{
                id
            }
        });
        product=await Product.findByPk(product.id,{
            include:[
                {association:'Seller'},
                {association:'Sales'},
                {association:'Transactions'},
                {association:'Category'},
                ,
            ],
        });
        return product
    },

module.exports=productsRepository