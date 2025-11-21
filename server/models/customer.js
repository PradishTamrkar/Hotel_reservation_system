const {DataTypes} = require('sequelize')
const bcrypt = require('bcrypt')
const sequelize = require('../config/db')
const booking = require('./booking')

const customer = sequelize.define(
    'customer', 
    {
        customer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        middle_name :{
            type:DataTypes.STRING,
            allowNull: true
        },
        last_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate:{
                isEmail:true
            }
        },
        customer_username: {
            type: DataTypes.STRING,
            allowNull:true,
            unique:true
        },
        guest_check_out: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        customer_password: {
                type:DataTypes.STRING,
                allowNull:true
        },
        gender:{
            type: DataTypes.ENUM("Male", "Female", "Others"),
            allowNull:false
        },
        phone_no: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        nationality:{
            type: DataTypes.STRING,
            allowNull:false
        },
        citizenship_id:{
            type: DataTypes.STRING,
            allowNull:false
        }
    },
    {
        timestamps:false,
        freezeTableName: true
    },  
)

module.exports = customer