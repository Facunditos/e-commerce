'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.hasMany(models.User,{
        as:"Users",
        foreignKey:"role_id"
      })
    }
  }
  Role.init({
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
      defaultValue:'role without description',
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Role',
    paranoid:true
  });
  return Role;
};