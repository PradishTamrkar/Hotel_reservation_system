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
            allowNull: true,
            references: {
                model: "customer",
                key: "customer_id"
            }
        },
        guest_name:{
            type: DataTypes.STRING,
            allowNull:true
        },
        guest_email:{
            type:DataTypes.STRING,
            allowNull:true
        },
        guest_phone:{
            type:DataTypes.STRING,
            allowNull:true
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