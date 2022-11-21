const {User,Category}=require("../models/index");
const {faker}=require("@faker-js/faker");

function assignRandomEvenIntegerBetween(min,max) {
  const integer=Math.floor(Math.random()*(max-min)+min);
  const evenInteger=integer%2==0?integer:integer+1;
  return evenInteger
};

function assignRandomIntegerBetween(min,max) {
  const integer=Math.floor(Math.random()*(max-min)+min);
  return integer
};

function assignRandomFloatBetween(min,max) {
  const float=Math.random()*(max-min)+min;
  return float
};



module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersList=await User.findAll();
    const categoriesList=await Category.findAll();
    //Se construte una lista de productos. Para evitar que un usuario pueda participar en una transacción tanto como vendedor como comprador, lo cual no tiene lógica, únicamente pueden ser vendedores aquellos usuarios con id par, y únicamente compradores aquellos con id impar. Para elegir de manera aleatoria los id correspondientes a las foreign keys de los atributos seller_user y category, se limitó el rango de manera tal que no pueda asignarse id inexistentes en las respectivas tablas. 
    const productsList=
    Array(100)
    .fill(0)
    .map(()=>{
        return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price:assignRandomFloatBetween(25,14000),
        seller_user_id:assignRandomEvenIntegerBetween(2,usersList.length),
        category_id: assignRandomIntegerBetween(1,categoriesList.length+1),
        stock: assignRandomIntegerBetween(1,145),
        status: 'active',
        image:faker.image.animals(undefined,undefined,true),
        createdAt:faker.date.recent(365*2),
        updatedAt:undefined,
        deletedAt:null
      }
    });
    //Se aplica un forEach para: primero, asignar al updatedAt la misma fecha del creteadAt; y segundo, para eliminar aquellos productos con nombre repetido de manetal tal de evitarse que sea violada la contraint unique key aplicada sobre la column name 
    const uniquesProductsList=[];
    //Se aplica un forEach para: primero, eliminar aquellos productos con nombre repetido de manetal tal de evitarse que sea violada la constraint unique key aplicada sobre la column name; segundo, editar la descripción en caso que el id sea par; y tercero, asignar al updatedAt la misma fecha del creteadAt 
    productsList.forEach((product,index)=>{
      const productOnArray=uniquesProductsList.filter(productOnListFiltered=>productOnListFiltered.name===product.name) 
      const isUnique=productOnArray.length===0?true:false  
      if (isUnique){
        product.updatedAt=product.createdAt;
        uniquesProductsList.push(product)
      };
    });
    await queryInterface.bulkInsert(
      'Products',
      uniquesProductsList, 
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
    
  }
};