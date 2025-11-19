const {createBooking, getAllBooking, getBookingByID , getBookingByCustomerId, updateBooking, deleteBooking, searchBookingByCDetail} = require("../service/bookingService")

//Booking Creation
const handleCreateBooking = async (req,res) => {
    try{
        const booking = await createBooking(req.body, req.user)
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
const handleGetBookingsByCustomerId = async (req,res) => {
    try{
        const customerId = req.params.customerId

        if (req.user.role !== 'admin' && req.user.id !== parseInt(customerId)) {
            return res.status(403).json({ error: 'Unauthorized: Access Denied' });
        }
        const history = await getBookingByCustomerId(customerId)
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

const handleSearchBookingByCDetail = async (req,res) => {
    try{
        const {search}= req.query
        const booking = await searchBookingByCDetail(search)
        res.json(booking)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}
module.exports = {
    handleCreateBooking,
    handleGetAllBooking,
    handleGetBookingByID,
    handleGetBookingsByCustomerId,
    hanldeUpdateBooking,
    handleDeleteBooking,
    handleSearchBookingByCDetail
}
