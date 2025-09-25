const {DataTypes} = require('sequelize')
const bcrypt = require('bcrypt')
const sequelize = require('../config/db')

const admin = sequelize.define(
    'admin',
    {
        admin_id: {
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        admin_username: {
            type:DataTypes.STRING,
            allowNull: false
        },
        admin_email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        contact_nO: {
            type: DataTypes.INTEGER,
            allowNull:false
        }
    },
    {
        freezeTableName: true
    }
)

module.exports = admin;