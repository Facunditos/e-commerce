'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaction_product', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"transactions",
          key:"id",
        },
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"products",
          key:"id",
        },
      },
      price: {
        type: Sequelize.FLOAT(25,2),
        allowNull:false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue:1,
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaction_product');
  }
};