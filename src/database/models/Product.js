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
        through:"transaction_details",
        foreignKey:"product_id",
        otherKey:"transaction_id"
      });
      Product.hasMany(models.Transaction_Detail,{
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
  };
  Product.init({
    name: DataTypes.STRING(150),
    description: DataTypes.TEXT,
    quantity: DataTypes.INTEGER,
    status: DataTypes.STRING(20),
    seller_user_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    deletedAt:DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Product',
    paranoid:true
  });
  return Product;
};