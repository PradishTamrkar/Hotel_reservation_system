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
        room_no: {
            type: DataTypes.INTEGER,
            allowNull:false,
            references: {
                model: "room",
                key: "room_no"
            }
        },
        room_amenity_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        room_amenity_description: {
            type: DataTypes.TEXT
        },
        room_amenity_image: {
            type: DataTypes.BLOB
        }
    },
    {
        freezeTableName: true
    }
)

module.exports = room_amenity