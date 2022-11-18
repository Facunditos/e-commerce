const {Transaction,Product}=require("./database/models/index");
const sequelize=require("sequelize")

async function countProductsByCategory(){
    try{
        const products=await Product.findAll({
            attributes:[
                'category_id',
                [sequelize.literal('(select name from categories where categories.id=Product.category_id)'),'categoria_name'],
                [sequelize.literal('count(name)'),'cantidad_de_productos']
            ],
            group:'category_id',
            order:[['cantidad_de_productos','desc']],
            raw:true
        }); 
        return console.log(products,products[20]);
    } catch(e){
        return console.log(e);
    }
}

countProductsByCategory();