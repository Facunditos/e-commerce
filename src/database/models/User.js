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
      User.belongsTo(models.Role,{
        as:"Role",
        foreignKey:"role_id"
      });
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
      validate:{
        notEmpty:true,
      },
    },
    last_name: {
      type:DataTypes.STRING(150),
      allowNull:false,
      validate:{
        notEmpty:true,
      },
    },
    email: {
      type:DataTypes.STRING(150),
      unique:true,
      allowNull:false,
      validate:{
        notEmpty:true,
      },
    },
    password: {
      type:DataTypes.STRING(150),
      allowNull:false,
      validate:{
        notEmpty:true,
      },
    },
    role_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notEmpty:true,
      },
    },
    image_url: {
      type:DataTypes.STRING(150),
      allowNull:false,
      defaultValue:"https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/user-anonymous.png",
      validate:{
        notEmpty:true,
      },
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    paranoid:true
  });
  return User;
};