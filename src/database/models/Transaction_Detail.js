'use strict';
const {
  Model
} = require('sequelize');
const Product = require('./Product');
module.exports = (sequelize, DataTypes) => {
  class Transaction_Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction_Detail.belongsTo(models.Transaction,{
        as:'Transaction',
        foreignKey:'transaction_id'
      });
      Transaction_Detail.belongsTo(models.Transaction,{
        as:'Product',
        foreignKey:'product_id'
      });
    }
  }
  Transaction_Detail.init({
    transaction_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction_Detail',
  });
  return Transaction_Detail;
};