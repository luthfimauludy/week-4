"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Events.belongsTo(models.Cities, {
        as: "cities",
        foreignKey: "cityId",
      });
    }
  }
  Events.init(
    {
      title: DataTypes.STRING,
      descriptions: DataTypes.STRING,
      cityId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Events",
    }
  );
  return Events;
};
