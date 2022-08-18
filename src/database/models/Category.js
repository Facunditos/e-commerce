'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      Category.hasMany(models.Product,{
        as:"Products",
        foreignKey:"category_id"
      });
    }
  }
  Category.init({
    name: {
      type:DataTypes.STRING(150),
      allowNull:false,
      unique:true,
      validate:{
        notEmpty:true,
      },
    },
    description: {
      type:DataTypes.TEXT,
      allowNull:false,
      defaultValue:'category without description',
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Category',
    paranoid:true,
  });
  return Category;
};