const {DataTypes} = require('sequelize')
const sequelize = require('../config/db');
const room_amenity = require('./roomAmenities');

const room = sequelize.define(
    'room', 
    {
        room_no:{
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true
        },
        room_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price_per_night: {
            type: DataTypes.STRING,
            allowNull: false
        },
        capacity: {
            type: DataTypes.STRING,
            allowNull:false
        },
        room_images: {
            type: DataTypes.STRING,
            allowNull:true
        },
        room_description:{
            type:DataTypes.TEXT,
            allowNull:true
        },
        room_status: {
            type: DataTypes.ENUM('Not-Available','Available'),
            defaultValue: 'Available'
        }
    },
    {
        freezeTableName: true,
    }
)

module.exports = room;