'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      Transaction.belongsToMany(models.Product,{
        as:"Products",
        through:models.TransactionProduct,
        foreignKey:"transaction_id",
        otherKey:"product_id"
      });
      Transaction.belongsTo(models.User,{
        as:"Buyer",
        foreignKey:"buyer_user_id"
      });
      Transaction.hasMany(models.TransactionProduct,{
        as:"Details",
        foreignKey:"transaction_id"
      });
    }
  }
  Transaction.init({
    buyer_user_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notEmpty:true,
      },
    },
    worth: {
      type:DataTypes.FLOAT(25,2),
      allowNull:false,
      validate:{
        notEmpty:true,
      },
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Transaction',
    paranoid:true
  });
  return Transaction;
};