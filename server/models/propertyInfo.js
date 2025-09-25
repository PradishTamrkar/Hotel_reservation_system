const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const property_info = sequelize.define(
    'property_information',
    {
        property_info_id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        opening_time: {
            type: DataTypes.TIME,
            allowNull:false
        },
        closing_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        parking_info: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        pet_policy_info: {
            type: DataTypes.TEXT,
            allowNull:false
        }
    },
    {
        freezeTableName: true
    }
)
module.exports =  property_info