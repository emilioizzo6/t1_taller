'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Level extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Level.hasMany(models.User, {
        foreignKey: 'level_id',
        as: 'users',
      });
    }
  }
  Level.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
  }, {
    sequelize,
    modelName: 'Level',
  });
  Level.findWithUsers = async function (id) {
    return Level.findByPk(id, {
      include: [{
        model: sequelize.models.User,
        as: 'users'
      }]
    });
  }
  return Level;
};