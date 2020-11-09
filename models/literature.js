'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Literature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Literature.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
        },
        as: 'user',
      });
    }
  }
  Literature.init(
    {
      title: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      publication_date: DataTypes.STRING,
      pages: DataTypes.STRING,
      isbn: DataTypes.STRING,
      author: DataTypes.STRING,
      status: DataTypes.STRING,
      attache: DataTypes.STRING,
      image: DataTypes.STRING,
      year: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Literature',
    }
  );
  return Literature;
};
