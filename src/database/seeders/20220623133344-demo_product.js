'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('products', [{
        name: "manteca",
        description: "manteca de 500 grs marca La Serenísima",
        quantity: 50,
        status: "activo",
        seller_user_id: 2,
        category_id: 4
      },{
        name: "dulce de leche",
        description: "dulce de leche de 400 grs marca La Paulina",
        quantity: 10,
        status: "activo",
        seller_user_id: 3,
        category_id: 2
      }], {});
   
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};
