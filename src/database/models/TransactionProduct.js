'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      TransactionProduct.belongsTo(models.Transaction,{
        as:'Transaction',
        foreignKey:'transaction_id'
      });
      TransactionProduct.belongsTo(models.Product,{
        as:'Product',
        foreignKey:'product_id'
      });
    }
  }
  TransactionProduct.init({
    transaction_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notEmpty:true,
      },
    },
    product_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notEmpty:true,
      },
    },
    price: {
      type:DataTypes.FLOAT(25,2),
      allowNull:false,
      validate:{
        notEmpty:true,
      },
    },
    quantity: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notEmpty:true,
      },
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TransactionProduct',
    tableName:'Transaction_Product',
    paranoid:true
  });
  return TransactionProduct;
};