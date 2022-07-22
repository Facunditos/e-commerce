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
    name: {
      type:DataTypes.STRING(150),
      validate: {
        notEmpty: true,
        notNull: true,
      },
      allowNull: false,
    },
    description: {
      type:DataTypes.TEXT,
      validate: {
        notEmpty: true,
        notNull: true,
      },
      allowNull: false,
    },
    quantity: {
      type:DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        notNull: true,
      },
      allowNull: false,
    },
    status: {
      type:DataTypes.STRING(20),
      validate: {
        notEmpty: true,
        notNull: true,
      },
      allowNull: false,
    },
    seller_user_id: {
      type:DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        notNull: true,
      },
      allowNull: false,
    },
    category_id: {
      type:DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        notNull: true,
      },
      allowNull: false,
    },
    deletedAt:DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Product',
    paranoid:true
  });
  return Product;
};