/* const {Category}=require("./database/models/index");

async function updateCategory(id,body){
    const categogyUpdating=await Category.findByPk(id,{
        attributes:['id','name']
    });
    console.log(categogyUpdating);
    const {name,description}=body;
    const update={};
    if (name) update.name=name;
    if (description) update.description=description;
    const categoriesUpdated=await categogyUpdating.update(update);
    return console.log(categoriesUpdated)
}; */
/* const {Product}=require("./database/models/index");

async function createProduct(){
    const product=await Product.create({
        "name": "new product 3",
        "description": "",
        "price": 700,
        "seller_user_id": 10,
        "stock": 15,
        "status": "active",
        image:'adadd'
    });
    await product.createCategory({
        name:'cómo estás aprendiendo'
    })
    return console.log(product)
}; 



createProduct(); */

if (2+2===4){
    let numero=12
};
console.log(numero);
