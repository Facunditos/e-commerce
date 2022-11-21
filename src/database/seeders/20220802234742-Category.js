'use strict';
const {faker}=require("@faker-js/faker");
//Se construte una lista de categorías de productos.
const  categoriesList=
  Array(100)
      .fill(0)
      .map(()=>{
          return {
            name:faker.commerce.department(),
            description:"This category doesn't have a description",
            createdAt:faker.date.recent(365*2),
            updatedAt:undefined,
            deletedAt:null
          } 
          
      })
const uniquesCategoriesList=[];
//Se aplica un forEach para: primero, eliminar aquellos productos con nombre repetido de manetal tal de evitarse que sea violada la constraint unique key aplicada sobre la column name; segundo, editar la descripción en caso que el id sea par; y tercero, asignar al updatedAt la misma fecha del creteadAt 
categoriesList.forEach((category,index)=>{
    const categoryOnArray=uniquesCategoriesList.filter(categoryOnListFiltered=>categoryOnListFiltered.name===category.name) 
    const isUnique=categoryOnArray.length===0?true:false  
    if (isUnique){
      if (index%2===0) category.description=faker.lorem.text();
      category.updatedAt=category.createdAt;
      uniquesCategoriesList.push(category)
    };
});
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'categories',
      uniquesCategoriesList, 
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
    
  }
};