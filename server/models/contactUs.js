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
        c_name:{
            type: DataTypes.STRING,
            allowNull:false
        },
        c_email:{
            type:DataTypes.STRING,
            allowNull:false
        },
        message:{
            type: DataTypes.TEXT,
            allowNull:true
        }
    },
    {
        timestamps:false,
        freezeTableName: true
    }
)

module.exports = contact_us