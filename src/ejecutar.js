const {Product}=require("./database/models/index");

async function agregarProducto() {
    try{
        const product=await Product.create({
            name:120,
            description:'',
            price:45.20,
            seller_user_id:2,
            category_id:3,
            stock:450,
            status:'active',
            image_url:'adasdfadsdf'
        });
        return console.log(product);
    } catch(e){console.log(e);}
    
};

agregarProducto();

console.log('lindo día es hoy'+'\nqúe lindo día será mañana');