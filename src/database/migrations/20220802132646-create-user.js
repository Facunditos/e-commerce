'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING(150)
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING(150)
      },
      email: {
        allowNull: false,
        unique:true,
        type: Sequelize.STRING(150)
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(150)
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"Roles",
          key:"id"
        }
      },
      image: {
        type: Sequelize.STRING(150),
        defaultValue:"https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/user-anonymous.png",
        
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
    await queryInterface.dropTable('users');
  }
};