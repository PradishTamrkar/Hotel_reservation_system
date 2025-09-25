const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const contact_us = sequelize.define(
    'contact_us', 
    {
        contact_id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        related_suject: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        message: {
            type: DataTypes.TEXT,
            allowNull:true
        }
    },
    {
        freezeTableName: true
    }
)

module.exports = contact_us