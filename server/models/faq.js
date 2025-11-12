const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const FAQ = sequelize.define(
    'faq',
    {
        faq_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        faq_questions:{
            type: DataTypes.TEXT,
            allowNull:false
        },
        faq_answers: {
            type: DataTypes.TEXT,
            allowNull:false
        },
        is_featured:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
    },
    {
        timestamps:false,
        freezeTableName: true
    }
)

module.exports = FAQ