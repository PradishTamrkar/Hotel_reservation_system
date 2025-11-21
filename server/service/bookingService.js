const { db: sequelize } = require("../config/config");
const { QueryTypes } = require("sequelize");
const Booking =require("../models/booking")
const BookingDetails = require("../models/bookingDetails")
const Room = require("../models/room")
const Customer = require("../models/customer")
const {isRoomAvailable} = require("./roomService")

const sqlAllBooking =`
SELECT 
    b.booking_id,
    b.booking_date, 
    b.check_in_date, 
    b.check_out_date, 
    b.total_amount,
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

//create booking
const createBooking = async (data,user = null) => {
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
    } = data

    
    let customerIdToUse = customer_id

    // If a logged-in user is making the booking, use their ID
    if (user && user.role === "customer") {
        customerIdToUse = user.id;
    }

    //if not a customer then them treat as guest
    else if(!customerIdToUse){
        if(!first_name || !last_name || !email || !phone_no || !gender || !address || !nationality || !citizenship_id){
            throw new Error('Guest information must be provided')
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
                customer_username: null,
                customer_password: null,
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
    if(nights <= 0)
        throw new Error("check_out_date must be after the check_in_date")

    for (const rm of rooms){
        //check availablilty
        const available = await isRoomAvailable(rm.room_id, check_in_date, check_out_date)
        if(!available)
            throw new Error(`Room ${rm.room_id} is already booked`)
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
            throw new Error(`Room ${rm.room_id} is not found in the database`)
        
        if(roomData.room_status !== 'Available')
            throw new Error (`Room ${rm.room_id} is not available`)
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
        if (offerData && offerData.offered_discount){
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
    return booking
};

//get all booking
const getAllBooking = async (pageNumber = 1, limit =10 ) => {
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
    return booking
}

//get single booking
const getBookingByID = async(id) => {
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
        throw new Error('Booking not found')
    return booking[0]
}

//bookingHistory
const getBookingByCustomerId = async (customerId) => {
    const myBookings = await sequelize.query(
        `
        SELECT 
            b.booking_id,
            b.booking_date,
            b.check_in_date,
            b.check_out_date,
            b.total_amount,
            json_agg(
                json_build_object(
                    'room_no', r.room_no,
                    'room_catagory_name', rc.room_catagory_name,
                    'price_per_night', rc.price_per_night
                )
            ) AS room_details
        FROM booking b
        LEFT JOIN booking_details bd ON b.booking_id = bd.booking_id
        LEFT JOIN room r ON bd.room_id = r.room_id
        LEFT JOIN room_catagory rc ON r.room_catagory_id = rc.room_catagory_id
        WHERE b.customer_id = :customer_id
        GROUP BY b.booking_id, b.booking_date, b.check_in_date, b.check_out_date, b.total_amount
        ORDER BY b.check_in_date DESC
        `,
        {
            replacements: {customer_id: customerId},
            type: QueryTypes.SELECT
        }
    )
    return myBookings
}

const updateBooking =async (booking_id, body, user) => {
    const booking = await Booking.findByPk(booking_id)
    if(!booking) 
        throw new Error("Booking Not Found")

    //only the admin or the cusotmer that booked can perform updation
     if(user.role !== "admin" && user.id !== booking.customer_id)
        throw new Error("Unauthorized:Access Denied")
     
     //preventing update after check-in
    if(new Date(booking.check_in_date)<= new Date())
        throw new Error("Cannot modify past bookings")

    await booking.update(body)
    return booking;
}

const deleteBooking = async (booking_id,user) => {
    const booking = await Booking.findByPk(booking_id)
    const bookedRooms = await BookingDetails.findAll({where: { booking_id }})
    if(!booking)
        throw new Error('Booking not found')
        
    //only admin or customer that booked can perform deletion
    if(user.role === 'admin'){

    }else if (user.role === 'customer'){
        if(user.id !== booking.customer_id)
            throw new Error('Unauthorized: Access Denied');
        
        if(new Date(booking.check_in_date) <= new Date())
            throw new Error('Cannot delete past bookings');
    } else {
        throw new Error('Unauthorized: Access Denied');
    }
        
    await BookingDetails.destroy({ where: { booking_id:booking_id } });
        
    for(const r of bookedRooms){
        await Room.update({room_status: 'Available'},{where: {room_id: r.room_id}})
    }
    await booking.destroy();
    return {message: 'Booking deleted successfully'}
}

const searchBookingByCDetail = async (search) => {
    if(!search) 
        return res.status(400).json({message: "Search Query is required"})

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
    return (booking)
}


module.exports = { 
    createBooking,
    getAllBooking,
    getBookingByID,
    getBookingByCustomerId,
    updateBooking,
    deleteBooking,
    searchBookingByCDetail
}