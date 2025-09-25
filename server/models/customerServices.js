const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const customer_services= sequelize.define(
    'customer_services',
    {
        serviceID: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        serviceName: {
            type: DataTypes.STRING,
            allowNull:false
        },
        serviceImage: {
            type: DataTypes.BLOB,
        },
        serviceDescription: {
            type: DataTypes.TEXT
        }
    }
)

module.exports = customer_services