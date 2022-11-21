'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(150),
        unique:true,
        allowNull:false,
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.FLOAT(25,2),
        allowNull:false,
      },
      seller_user_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"users",
          key:"id",
        },
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"categories",
          key:"id",
        },
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull:false,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull:false,
      },
      image: {
        allowNull: false,
        type: Sequelize.STRING(150)
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
    await queryInterface.dropTable('products');
  }
};