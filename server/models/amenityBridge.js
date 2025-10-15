const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const amenity_bridge = sequelize.define(
  'amenity_bridge',
  {
    catagory_amenity_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    room_catagory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'room_catagory',
        key: 'room_catagory_id'
      }
    },
    room_amenity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'room_amenity',
        key: 'room_amenity_id'
      }
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

module.exports = amenity_bridge;