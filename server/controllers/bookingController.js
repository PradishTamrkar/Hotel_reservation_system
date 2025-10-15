const { QueryTypes, json } = require("sequelize");
const sequelize = require("../config/db");
const Booking = require("../models/booking")
const BookingDetails = require("../models/bookingDetails")
const Room = require("../models/room");
const Customer = require('../models/customer');
const room = require("../models/room");

//Joins
const sqlAllBooking =`
SELECT 
    b.booking_id,
    b.booking_date, 
    b.check_in_date, 
    b.check_out_date, 
    c.first_name || COALESCE(' ' || c.middle_name, '') || ' ' || c.last_name AS customer_name,
    c.email
FROM booking b 
JOIN customer c ON b.customer_id = c.customer_id
` 

const sqlBookingByID = `
SELECT
    b.booking_id,
    b.booking_date, 
    b.check_in_date, 
    b.check_out_date, 
    b.total_amount,
    c.first_name || COALESCE(' ' || c.middle_name, '') || ' ' || c.last_name AS customer_name,
    c.email,
    json_agg(
        json_build_object(
            'booking_details_id',bd.booking_details_id,
            'room_catagory_name',rc.room_catagory_name,
            'price_per_night',rc.price_per_night,
            'room_no',r.room_no,
            'offer_name',p.offer_name,
            'offered_discount',p.offered_discount
    )) AS details
    FROM booking b
    JOIN customer c ON b.customer_id = c.customer_id
    LEFT JOIN booking_details bd ON b.booking_id = bd.booking_id
    LEFT JOIN room r ON bd.room_id = r.room_id
    LEFT JOIN room_catagory rc on r.room_catagory_id = rc.room_catagory_id
    LEFT JOIN promos_and_offers p ON bd.offer_id = p.offer_id
`

const sqlBookingGroupBy = `
 GROUP BY b.booking_id, b.check_in_date, b.check_out_date, b.total_amount, c.customer_id, c.first_name, c.middle_name, c.last_name, c.email
`

//using a helper function to check room availablilty for a specified date range so that booking wont overlap
async function isRoomAvailable(room_id,check_in_date,check_out_date){
    const res = await sequelize.query(
        `
        SELECT 1 FROM booking b
        JOIN booking_details bd ON b.booking_id=bd.booking_id
        WHERE bd.room_id = :room_id
        AND NOT(b.check_out_date <= :check_in_date OR b.check_in_date >= :check_out_date)
        LIMIT 1
        `,
        {
            replacements: {room_id, check_in_date, check_out_date},
            type:QueryTypes.SELECT
        }
    )
    return !res || res.length === 0 
}

//Booking Creation
const createBooking = async (req,res) => {
    try{
        const {
            customer_id, 
            first_name,
            middle_name,
            last_name, 
            email, 
            phone_no,
            gender,
            address,
            nationality,
            citizenship_id, 
            rooms, 
            check_in_date, 
            check_out_date
        } = req.body

        let customerIdToUse = customer_id
        //if not a customer then them treat as guest
        if(!customer_id){
            if(!first_name || !last_name || !email || !phone_no || !gender || !address || !nationality || !citizenship_id){
                return res.status(400).json({message:'Guest information must be provided'})
            }
            let guest = await Customer.findOne({
                where: { email, phone_no }
            })

        if(!guest){
            guest = await Customer.create({
                first_name,
                middle_name: middle_name || null,
                last_name,
                email,
                phone_no,
                gender,
                address,
                nationality,
                citizenship_id,
                guest_check_out: true 
            })
        }
        customerIdToUse = guest.customer_id;
    }
        let total_amount = 0;
        let roomDetails = [];
        //night calculation
        const nights = Math.ceil(
        (new Date(check_out_date)- new Date(check_in_date))/(1000*60*60*24)
)

        for (const rm of rooms){
            //check availablilty
            const available = await isRoomAvailable(rm.room_id, check_in_date, check_out_date)
            if(!available)
                return res.status(400).json({message: `Room ${rm.room_id} is already booked`})
            const [roomData] = await sequelize.query(
                `SELECT 
                    rc.room_catagory_id,
                    rc.price_per_night,
                    rc.offer_id,
                    r.room_id,
                    r.room_status
                    FROM room r
                    JOIN room_catagory rc ON r.room_catagory_id = rc.room_catagory_id
                    WHERE r.room_id = :room_id
                    `,
                {
                    replacements: {room_id: rm.room_id},
                    type: QueryTypes.SELECT
                }
            )
            if(!roomData)
                return res.status(400).json({message: `Room ${rm.room_id} is not found in the database`})
            
            if(roomData.room_status !== 'Available')
                return res.status(400).json({message:`Room ${rm.room_id} is not available`})
            let roomPrice = parseFloat(roomData.price_per_night) 
            //for offers
            if(roomData.offer_id){
                const [offerData] = await sequelize.query(
                    `SELECT offered_discount FROM promos_and_offers WHERE offer_id= :id`,
                    {
                        replacements: {id:roomData.offer_id},
                        type:QueryTypes.SELECT
                    }
                )
                if (offerData){
                roomPrice = roomPrice - (roomPrice * offerData.offered_discount) / 100
                }
            }
            total_amount = total_amount + roomPrice * nights
            console.log({ roomPrice, nights, total_amount });

            //to keep track of details
            roomDetails.push({
                room_id: rm.room_id,
                room_catagory_id: roomData.room_catagory_id,
                offer_id:roomData.offer_id || null,
                price_per_night: roomPrice
            })
        }

        //create booking
        const bookingData = {
            customer_id: customerIdToUse, 
            check_in_date,
            check_out_date,
            total_amount: total_amount,
            booking_date: new Date()
        }
        const booking = await Booking.create(bookingData)


        //create bookingdetails
        for(const detail of roomDetails){
            await BookingDetails.create({
                booking_id:booking.booking_id,
                room_id:detail.room_id,
                offer_id:detail.offer_id
            })

            await Room.update(
                {room_status: "Not-Available"},
                {where: {room_id: detail.room_id}}
            )
        }
        res.status(201).json(booking)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL booking
const getAllBooking = async (req,res) => {
    try{
        const pageNumber = parseInt(req.query.pageNumber) || 1
        const limit = parseInt(req.query.limit) || 10
        const offset = (pageNumber -1 ) * limit 
        const booking = await sequelize.query(`
            ${sqlAllBooking}
            ORDER BY b.booking_id
            LIMIT :limit OFFSET :offset
            `,
            {
                replacements:{limit,offset},
                type:QueryTypes.SELECT
        });
        res.json(booking)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single booking
const getBookingByID = async(req,res) => {
    try{
        const {id} = req.params
        const booking = await sequelize.query(
            `
            ${sqlBookingByID}
            WHERE b.booking_id = :id
            ${sqlBookingGroupBy}
            `,
            {
            replacements:{ id },
            type: QueryTypes.SELECT
            }
        )
        if(!booking || booking.length === 0) 
            return res.status(404).json({message: 'Booking not found'})
        res.json(booking[0])
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  

//Update booking Info
const updateBooking = async(req,res) => {
    try{
        const booking = await Booking.findByPk(req.params.id)
        if(!booking)
            return res.status(404).json({message: 'Booking not found'})

        //only the admin or the cusotmer that booked can perform updation
        if(req.user.role !== "admin" && req.user.id !== booking.customer_id)
            return res.status(401).json({message:"Unauthorized:Access Denied"})
        
        //preventing update after check-in
        if(new Date(booking.check_in_date)<= new Date())
            return res.status(400).json({error: "Cannot modify past bookings"})

        await booking.update(req.body)
        res.json({message: "booking updated successfully",booking})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Booking
const deleteBooking = async (req,res) => {
    try{
        const booking = await Booking.findByPk(req.params.id)
        const bookedRooms = await BookingDetails.findAll({where: { booking_id: req.params.id }})
        if(!booking)
            return res.status(404).json({message: 'Booking not found'})

        //only admin or customer that booked can perform deletion
        if(req.user.role !== "admin" && req.user.id !== booking.customer_id)
            return res.status(401).json({message:"Unauthorized:Access Denied"})

        //preventing cancellation after check-in
        if(new Date(booking.check_in_date)<= new Date())
            return res.status(400).json({error: "Cannot delete past bookings"})
        
        await BookingDetails.destroy({ where: { booking_id: req.params.id } });
        
        for(const r of bookedRooms){
            await Room.update({room_status: 'Available'},{where: {room_id: r.room_id}})
        }
        await booking.destroy();
        res.json({message: 'Booking deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}
const searchBookingByCDetail = async (req,res) => {
    try{
        const {search} = req.query; //for admin to pass search
        if(!search) 
            return res.status(400).json({message: "Query is required"})
    
    const booking = await sequelize.query(
        `${sqlBookingByID}
        WHERE c.first_name ILIKE :search 
        OR c.middle_name ILIKE :search
        OR c.last_name ILIKE :search
        OR c.phone_no ILIKE :search
        OR c.email ILIKE :search
        ${sqlBookingGroupBy}
        `,
        {
            replacements: {
                search: `%${search}%`
            },
            type:QueryTypes.SELECT
        }
    )
    if(!booking || booking.length === 0){
        return res.status(404).json({message: "No bookings Found"})
    }
    res.json(booking)
    }
    catch(err){
        res.status(500).json({error: err.message})
    }   
}
exports.createBooking = createBooking
exports.getAllBooking = getAllBooking
exports.searchBookingByCDetail = searchBookingByCDetail
exports.getBookingByID = getBookingByID
exports.updateBooking = updateBooking
exports.deleteBooking = deleteBooking
