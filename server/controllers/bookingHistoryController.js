const { QueryTypes } = require("sequelize");
const sequelize = require("../config/db");
const BookingHistory = require("../models/bookingHistory")

//History JOINS
const sqlBookingHistory = `
SELECT
    h.history_id,
    c.customer_id,
    c.first_name || ' ' || c.middle_name || ' ' || c.last_name AS customer_name,
    b.booking_id,
    b.check_in_date,
    b.check_out_date,
    b.total_amount
FROM booking_history h
JOIN booking b ON h.booking_id = b.booking_id
JOIN customer c ON h.customer_id = c.customer_id
WHERE customer_id= :customer_id
`
//GET ALL booking history for a customer
const getAllBookingsByCustomer = async (req,res) => {
    try{
        const { customer_id} = req.params
        const [pastBookings] = await sequelize.query(
            sqlBookingHistory,
            {
                replacements: {customer_id: customer_id},
                type:QueryTypes.SELECT,
            },
        );
        if(pastBookings.length === 0)
            return res.status(404).json({message: "No Booking Found"})
        res.json(pastBookings)
    }catch(err){
        res.status(500).json({error: err.message})
    }a
}

exports.getAllBookingsByCustomer = getAllBookingsByCustomer