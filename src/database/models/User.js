'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      User.hasMany(models.Transaction,{
        as:"Buys",
        foreignKey:"buyer_user_id"
      });
      User.hasMany(models.Product,{
        as:"ProductsOnSale",
        foreignKey:"seller_user_id"
      });
    }
  }
  User.init({
    first_name: {
      type:DataTypes.STRING(150),
      allowNull:false,
    },
    last_name: {
      type:DataTypes.STRING(150),
      allowNull:false,
    },
    email: {
      type:DataTypes.STRING(150),
      unique:true,
      allowNull:false,
    },
    password: {
      type:DataTypes.STRING(150),
      allowNull:false,
    },
    is_admin: {
      type:DataTypes.BOOLEAN,
      defaultValue:false,
      allowNull:false,
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    paranoid:true
  });
  return User;
};