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
            allowNull: false,
            unique:true,
            validate: {
                isEmail: true
            }
        },
        admin_password: {
            type: DataTypes.STRING,
            allowNull:false,
        },
        contact_no: {
            type: DataTypes.STRING,
            allowNull:false
        }
    },
    {
        freezeTableName: true
    }
)

module.exports = admin;