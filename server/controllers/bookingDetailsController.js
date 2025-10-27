const {getAllBookingDetails, getBookingDetailsByBookingID } = require("../service/bookingDetailsService")

//GET ALL Booking Details
const handleGetAllBookingDetails = async (req,res) => {
    try{
        const bookingDetails = getAllBookingDetails();
        res.json(bookingDetails)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET booking details by booking id
const handleGetBookingDetailsByBookingID = async (req,res) => {
    try{
        const {booking_id} = req.params
        const bookingDetails = await getBookingDetailsByBookingID(booking_id)
        if(!bookingDetails.length)
            return res.status(404).json({message:'No details found for this booking'})
        res.json(bookingDetails)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    handleGetAllBookingDetails,
    handleGetBookingDetailsByBookingID
}