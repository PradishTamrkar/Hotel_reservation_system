const {DataTypes} = require('sequelize')
const sequelize = require('../config/db');
const booking_details = require('./bookingDetails');

const booking = sequelize.define(
    'booking',
    {
        booking_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customer_id: {
            type:DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "customer",
                key: "customer_id"
            }
        },
        booking_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        check_in_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        check_out_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        total_amount: {
            type: DataTypes.NUMERIC(20,5),
            allowNull: false
        }
    },
    {
        freezeTableName: true
    }
)
module.exports = booking;