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
      Product.hasMany(models.TransactionProduct,{
        as:"Sales",
        foreignKey:"product_id"
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
    },
    description: {
      type:DataTypes.TEXT,
      defaultValue:'producto sin descripción',
    },
    price: {
      type:DataTypes.FLOAT(25,2),
      allowNull:false,
    },
    seller_user_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    category_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    stock: {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    status: {
      type:DataTypes.STRING(150),
      allowNull:false,
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Product',
    paranoid:true
  });
  return Product;
};