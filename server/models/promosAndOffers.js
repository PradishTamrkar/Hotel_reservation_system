const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const promos_and_offers = sequelize.define(
    'promos_and_offers',
    {
        offer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        offer_name:{
            type: DataTypes.STRING,
            allowNull:false
        },
        offer_image:{
            type:DataTypes.STRING,
            allowNull:true
        },
        offer_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        offered_discount: {
            type: DataTypes.DECIMAL(5,2),
            allowNull: true
        }
    },
    {
        timestamps:false,
        freezeTableName: true
    }
)
module.exports = promos_and_offers