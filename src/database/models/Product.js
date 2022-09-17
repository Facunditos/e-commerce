'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      Product.belongsToMany(models.Transaction,{
        as:"Transactions",
        through:models.TransactionProduct,
        foreignKey:"product_id",
        otherKey:"transaction_id"
      });
      Product.belongsTo(models.User,{
        as:"Seller",
        foreignKey:"seller_user_id"
      });
      Product.belongsTo(models.Category,{
        as:"Category",
        foreignKey:"category_id"
      });
    }
  }
  Product.init({
    name: {
      type:DataTypes.STRING(150),
      allowNull:false,
      validate:{
        notEmpty:true,
      },
    },
    description: {
      type:DataTypes.TEXT,
      defaultValue:'producto sin descripción',
    },
    price: {
      type:DataTypes.FLOAT(25,2),
      allowNull:false,
      validate:{
        
        min:0,
      },
    },
    seller_user_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        isInt:true,
      },
    },
    category_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        isInt:true,
      },
    },
    stock: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        isInt:true,
      },
    },
    status: {
      type:DataTypes.STRING(150),
      allowNull:false,
      validate:{
        notEmpty:true,
        isIn: [['active', 'inactive']], 
      },
    },
    image_url: {
      type:DataTypes.STRING(150),
      allowNull:false,
      validate:{
        notEmpty:true,
      },
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Product',
    paranoid:true
  });
  return Product;
};