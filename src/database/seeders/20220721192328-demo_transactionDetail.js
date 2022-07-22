'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('transaction_details', [{
      transaction_id:1,
      product_id:1,
      quantity:2,
      deletedAt:null,
      createdAt:"2022-06-10 09:20:05",
      updatedAt:"2022-06-10 09:20:05",
    },{
      transaction_id:2,
      product_id:2,
      quantity:3,
      deletedAt:null,
      createdAt:new Date,
      updatedAt:new Date,
    },{
      transaction_id:2,
      product_id:8,
      quantity:5,
      deletedAt:null,
      createdAt:new Date,
      updatedAt:new Date,
    },{
      transaction_id:3,
      product_id:5,
      quantity:7,
      deletedAt:null,
      createdAt:new Date,
      updatedAt:new Date,
    },{
      transaction_id:4,
      product_id:3,
      quantity:2,
      deletedAt:null,
      createdAt:new Date,
      updatedAt:new Date,
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transaction_details', null, {});
  }
};
