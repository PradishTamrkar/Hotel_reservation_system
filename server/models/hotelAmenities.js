const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const hotel_amenity = sequelize.define(
    'hotel_amenity', 
    {
        hotel_amenity_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        hotel_amenity_name: {
            type: DataTypes.STRING,
            allowNull:false
        },
        hotel_amenity_description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        hotel_amenity_image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        timestamps:false,
        freezeTableName: true
    }
)

module.exports = hotel_amenity