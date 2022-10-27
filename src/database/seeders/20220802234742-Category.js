'use strict';
const {faker}=require("@faker-js/faker");
//Para asegurar de que no existan categorías repetidas se almacena en un array un listado de categorías únicas a partir de un array de 100 categorías
const  uniquesCategories=[];
Array(100)
    .fill(0)
    .map(()=>{
        return faker.commerce.department()
    })
    .map((category,index)=>{
        if (!uniquesCategories.includes(category)) {
            uniquesCategories.push(category)
        } 
    });
//Se construte una lista de categorías de productos. Se definió que, las categorías con id par, sí tienen texto de descripción.
const categoriesList=
Array(uniquesCategories.length)
    .fill()
    .map((value,index)=>{
        return {
            name:uniquesCategories[index],
            description:"This category doesn't have a description",
            createdAt:faker.date.recent(365*2),
            updatedAt:undefined,
            deletedAt:null
        }
    })
    .map((category,index)=>{
        category.updatedAt=category.createdAt;
        if (index%2==0) category.description=faker.lorem.text();
        return category 
    });

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Categories',
      categoriesList, 
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
    
  }
};