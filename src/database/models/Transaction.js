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
        through:"transaction_details",
        foreignKey:"transaction_id",
        otherKey:"product_id"
      });
      Transaction.belongsTo(models.User,{
        as:"Buyer",
        foreignKey:"buyer_user_id"
      });
      Transaction.hasMany(models.Transaction_Detail,{
        as:"Details",
        foreignKey:"transaction_id"
      });
    }
  };
  Transaction.init({
    buyer_user_id: {
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
    modelName: 'Transaction',
    paranoid:true
  });
  return Transaction;
};