const {DataTypes} = require('sequelize')
const sequelize = require('../config/db');
const room_amenity = require('./roomAmenities');
const room_catagory = require('./roomCatagory')

const room = sequelize.define(
    'room', 
    {
        room_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        room_catagory_id: {
            type: DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"room_catagory",
                key:"room_catagory_id"
            }
        },
        room_no: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        room_description:{
            type:DataTypes.TEXT,
            allowNull:true
        },
        capacity: {
            type: DataTypes.STRING,
            allowNull:false
        },
        room_status: {
            type: DataTypes.ENUM('Not-Available','Available'),
            defaultValue: 'Available'
        },
        room_images:{
            type: DataTypes.STRING,
            allowNull:true
        }
    },
    {
        timestamps:false,
        freezeTableName: true,
    }
)

module.exports = room;