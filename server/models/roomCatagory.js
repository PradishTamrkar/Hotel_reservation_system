const {DataTypes} = require('sequelize')
const sequelize = require('../config/db');
// const room_amenity = require('./roomAmenities');

const room_catagory = sequelize.define(
    'room_catagory', 
    {
        room_catagory_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        room_catagory_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        room_catagory_description:{
            type:DataTypes.STRING,
            allowNull:true
        },
        room_catagory_images: {
            type: DataTypes.STRING,
            allowNull:true
        },
        price_per_night: {
            type: DataTypes.STRING,
            allowNull: false
        },
        offer_id:{
            type: DataTypes.INTEGER,
            allowNull:true,
            references:{
                model:"promos_and_offers",
                key:"offer_id"
            }
        }
    },
    {
        timestamps:false,
        freezeTableName: true,
    }
)

module.exports = room_catagory;