'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
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
      is_admin: {
        defaultValue:false,
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Users');
  }
};