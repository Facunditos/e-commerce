'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [{
        name: "Alimentos y Bebidas",
        description: null,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      },{
        name: "Electrodomésticos",
        description: null,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      },{
        name: "Hogar y Muebles",
        description: null,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      },{
        name: "Herramientas",
        description: null,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      }], {});
    },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
