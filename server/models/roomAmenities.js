const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')
const room = require('./room')

const room_amenity = sequelize.define(
    'room_amenity', 
    {
        room_amenity_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        room_amenity_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        room_amenity_description: {
            type: DataTypes.TEXT
        }
    },
    {
        timestamps:false,
        freezeTableName: true
    }
)

module.exports = room_amenity