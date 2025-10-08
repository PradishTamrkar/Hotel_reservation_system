const { QueryError, QueryTypes } = require("sequelize")
const sequelize = require("../config/db")
const BookingDetails = require("../models/bookingDetails")

//Booking Details Creation
const createBookingDetails = async (req,res) => {
    try{
        const bookingDetails = await BookingDetails.create(req.body)
        res.status(201).json(bookingDetails)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL Booking Details
const getAllBookingDetails = async (req,res) => {
    try{
        const [bookingDetails] = await sequelize.query(sqlBookingDetails);
        res.json(bookingDetails)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single Booking Details
const getBookingDetailsByID = async(req,res) => {
    try{
        const{ id } = req.params
        const [bookingDetails] = await sequelize.query(
            sqlBookingDetails+`WHERE bd.booking_details_id=:id`,
            {
                replacements: { id },
                type: QueryTypes.SELECT
            }
            
        )
        if(!bookingDetails) 
            return res.status(404).json({message: 'Booking Details not found'})
        res.json(bookingDetails)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  

//Update Bookoing Details Info
const updateBookingDetails= async(req,res) => {
    try{
        const bookingDetails = await BookingDetails.findByPk(req.params.id)
        if(!bookingDetails)
            return res.status(404).json({message: 'Booking Details not found'})

        await bookingDetails.update(req.body)
        res.json(bookingDetails)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Booking Details
const deleteBookingDetails = async (req,res) => {
    try{
        const bookingDetails = await BookingDetails.findByPk(req.params.id)
        if(!bookingDetails)
            return res.status(404).json({message: 'Booking Details not found'})
        await bookingDetails.destroy();
        res.json({message: 'Booking Details deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.createBookingDetails= createBookingDetails
exports.getAllBookingDetails= getAllBookingDetails
exports.getBookingDetailsByID = getBookingDetailsByID
exports.updateBookingDetails = updateBookingDetails
exports.deleteBookingDetails = deleteBookingDetails