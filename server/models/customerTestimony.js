const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const customer_testimony = sequelize.define(
    'customer_testimony',
    {
        testimony_id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull:false
        },
        rating:{
            type:DataTypes.NUMBER,
            allowNull:true
        },
        customer_id:{
            type:DataTypes.INTEGER,
            allowNull:true,
            references: {
                model: "customer",
                key: "customer_id"
            }
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        middle_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,   
        },
        rating:{
            type: DataTypes.FLOAT,
            allowNull:false
        }
    }
)

module.exports = customer_testimony