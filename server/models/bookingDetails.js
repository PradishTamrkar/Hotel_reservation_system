const {DataTypes} = require('sequelize')
const sequelize = require('../config/db');
const room = require('./room');
const promos_and_offers = require('./promosAndOffers');
const booking = require('./booking');
const room_catagory = require('./roomCatagory');

const booking_details = sequelize.define(
    'booking_details',
    {
        booking_details_id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "booking",
                key: "booking_id"
            }
        },
        room_id: {
            type: DataTypes.INTEGER,
            allowNull:true,
            references: {
                model: "room",
                key:"room_id"
            }
        },
        offer_id:{
            type: DataTypes.INTEGER,
            allowNull:true,
            references: {
                model: "promos_and_offers",
                key: "offer_id"
            }
        }
    },
    {
        timestamps:false,
        freezeTableName: true
    }
)

module.exports = booking_details;