const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')
const booking = require('./booking')

const booking_history = sequelize.define(
    'booking_history', 
    {
        history_id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "customer",
                key: "customer_id"
            }
        },
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull:false,
            references: {
                model: "booking",
                key: "booking_id"
            }
        }
    },
    {
        freezeTableName: true
    }
)

module.exports = booking_history