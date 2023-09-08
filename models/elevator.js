'use strict';
const {
  Model,
  UUIDV4
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class Elevator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Elevator.hasMany(models.User, {
        foreignKey: 'elevator_id',
        as: 'users',
      });
    }

  }
  Elevator.init({
    id: {
      type: DataTypes.STRING,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    max_weight: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
    current_weight: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
    level: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
    doors: {
      type: DataTypes.ENUM('open', 'closed'),
      defaultValue: 'closed'
    }
  }, {
    sequelize,
    modelName: 'Elevator',
  });
  Elevator.findWithUsers = async function (id) {
    return Elevator.findByPk(id, {
      include: [{
        model: sequelize.models.User,
        as: 'users'
      }]
    });
  }
  Elevator.findAllWithUsers = async function () {
    return Elevator.findAll({
      include: [{
        model: sequelize.models.User,
        as: 'users'
      }]
    });
  }
  return Elevator;
};