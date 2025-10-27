const {createBooking, getAllBooking, getBookingByID , getBookingByCustomerId, updateBooking, deleteBooking} = require("../service/bookingService")

//Booking Creation
const handleCreateBooking = async (req,res) => {
    try{
        const booking = await createBooking(req.body)
        res.status(201).json(booking)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL booking
const handleGetAllBooking = async (req,res) => {
    try{
        const booking = await getAllBooking(req.query.pageNumber, req.query.limit)
        res.json(booking)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single booking
const handleGetBookingByID = async(req,res) => {
    try{
        const booking = await getBookingByID(req.params.id)
        res.json(booking)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//get booking history for customer
const handleGetMyBookings = async (req,res) => {
    try{
        const history = await getBookingByCustomerId(req.user.id)
        res.json(history)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Update booking Info
const hanldeUpdateBooking = async(req,res) => {
    try{
        const booking = await updateBooking(req.params.id, req.body, req.user)
        res.json({message: "booking updated successfully",booking})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Booking
const handleDeleteBooking = async (req,res) => {
    try{
        const response = await deleteBooking(req.params.id, req.user)
        res.json({message: 'Booking deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

// const searchBookingByCDetail = async (req,res) => {
//     try{
//         const {search} = req.query; //for admin to pass search
//         if(!search) 
//             return res.status(400).json({message: "Query is required"})
    
//     const booking = await sequelize.query(
//         `${sqlBookingByID}
//         WHERE c.first_name ILIKE :search 
//         OR c.middle_name ILIKE :search
//         OR c.last_name ILIKE :search
//         OR c.phone_no ILIKE :search
//         OR c.email ILIKE :search
//         ${sqlBookingGroupBy}
//         `,
//         {
//             replacements: {
//                 search: `%${search}%`
//             },
//             type:QueryTypes.SELECT
//         }
//     )
//     if(!booking || booking.length === 0){
//         return res.status(404).json({message: "No bookings Found"})
//     }
//     res.json(booking)
//     }
//     catch(err){
//         res.status(500).json({error: err.message})
//     }   
// }

module.exports = {
    handleCreateBooking,
    handleGetAllBooking,
    handleGetBookingByID,
    handleGetMyBookings,
    hanldeUpdateBooking,
    handleDeleteBooking
}

// exports.searchBookingByCDetail = searchBookingByCDetail
