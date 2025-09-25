const sequelize = require("../config/db");
const BookingHistory = require("../models/bookingHistory")

//History JOINS
const sqlBookingHistory = `
SELECT
    h.history_id,
    c.customer_id,
    b.booking_id
FROM booking_history h
JOIN booking b ON h.booking_id = b.booking_id
JOIN customer c ON h.customer_id = c.customer_id
`
//GET ALL booking history for a customer
const getAllBookingsByCustomer = async (req,res) => {
    try{
        const { customerID} = req.params
        const [pastBookings] = await sequelize.query(
            {
                where: {customerID},
            },
            sqlBookingHistory
        );
        if(pastBookings.length === 0)
            return res.status(404).json({message: "No Booking Found"})
        res.json(pastBookings)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.getAllBookingsByCustomer = getAllBookingsByCustomer