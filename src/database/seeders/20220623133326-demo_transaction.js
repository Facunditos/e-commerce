'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('transactions', [{
        buyer_user_id:6,
        deletedAt:null,
        createdAt:"2022-06-10 09:20:05",
        updatedAt:"2022-06-10 09:20:05",
      },{
        buyer_user_id:6,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      },{
        buyer_user_id:7,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      },{
        buyer_user_id:2,
        deletedAt:null,
        createdAt:new Date,
        updatedAt:new Date,
      }], {});
   
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('transactions', null, {});
  }
};
