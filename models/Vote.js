// Create a 3rd 'Through table': which is connecting the data between two other tables (User and Post) with their primary keys

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


class Vote extends Model {}

// define Vote table columns and configuration
Vote.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
//conect to user model        
user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
    }
  },
//conect to post model
post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'post',
      key: 'id'
    }
  }
},
{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'vote'
  }
);

module.exports = Vote;