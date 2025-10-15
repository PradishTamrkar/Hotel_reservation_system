const { QueryError, QueryTypes } = require("sequelize")
const sequelize = require("../config/db")
const BookingDetails = require("../models/bookingDetails")

//booking details JOIN
const sqlBookingDetails = `
SELECT 
    bd.booking_details_id,
    b.booking_id,
    b.check_in_date,
    b.check_out_date,
    c.customer_id,
    c.first_name || ' ' || c.middle_name || ' ' || c.last_name AS customer_name,
    r.room_id,
    p.offer_id,
    p.offer_name,
    p.offered_discount
FROM booking_details bd
JOIN booking b ON bd.booking_id = b.booking_id
JOIN customer c ON b.customer_id = c.customer_id
JOIN room r ON bd.room_id = r.room_id
JOIN room_catagory rc ON r.room_catagory_id = rc.room_catagory_id
LEFT JOIN promos_and_offers p ON bd.offer_id = p.offer_id
`
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
        const bookingDetails = await sequelize.query(`${sqlBookingDetails}`);
        res.json(bookingDetails)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single Booking Details
const getBookingDetailsByID = async(req,res) => {
    try{
        const{ id } = req.params
        const bookingDetails = await sequelize.query(
            `${sqlBookingDetails}
            WHERE bd.booking_details_id=:id
            `,
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