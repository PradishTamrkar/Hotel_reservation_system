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
        property_info_title:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        property_info_description:{
            type:DataTypes.TEXT,
            allowNull:true
        },
        property_info_image:{
            type:DataTypes.STRING,
            allowNull:true
        }
    },
    {
        timestamps:false,
        freezeTableName: true
    }
)
module.exports =  property_info
//poilicy