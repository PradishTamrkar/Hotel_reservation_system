const { QueryTypes } = require("sequelize");
const sequelize = require("../config/db");
const Booking = require("../models/booking")
const BookingDetails = require("../models/bookingDetails")
const BookingHistory = require("../models/bookingHistory");

//Joins
const sqlBooking =`
SELECT 
    b.booking_id, 
    b.booking_date, 
    b.check_in_date, 
    b.check_out_date, 
    b.total_amount, 
    c.customer_id, 
    c.first_name || ' ' || c.middle_name || ' ' || c.last_name AS customer_name, 
    c.email AS customer_email,
    json_agg(
        json_build_object(
            'booking_details_id',bd.booking_details_id,
            'room_no',r.room_no, 
            'room_type',r.room_type,
            'price_per_night',r.price_per_night,
            'offer_id',p.offer_id,
            'offer_name',p.offer_name,
            'offered_discount',p.offered_discount
        )) AS details
FROM booking b 
JOIN customer c ON b.customer_id = c.customer_id
JOIN booking_details bd ON b.booking_id = bd.booking_id
JOIN room r ON bd.room_no = r.room_no
LEFT JOIN promos_and_offers p ON bd.offer_id = p.offer_id
GROUP BY b.booking_id, b.check_in_date, b.check_out_date, b.total_amount, c.customer_id, c.first_name, c.middle_name, c.last_name, c.email 
` 
//Booking Creation
const createBooking = async (req,res) => {
    try{
        const {customer_id, rooms, check_in_date, check_out_date} = req.body
        let total_amount = 0;
        let roomDetails = [];
        //night calculation
        const nights = Math.ceil(
        (new Date(check_out_date)- new Date(check_in_date))/(1000*60*60*24)
)

        for (const room of rooms){
            const [roomData] = await sequelize.query(
                `SELECT price_per_night FROM room WHERE room_no= :room_no`,
                {
                    replacements: {room_no: room.room_no},
                    type: QueryTypes.SELECT
                }
            )
            let roomPrice = roomData.price_per_night; 
                //for offers
            if(room.offer_id){
                const [offerData] = await sequelize.query(
                    `SELECT offered_discount FROM promos_and_offers WHERE offer_id= :id`,
                    {
                        replacements: {id:room.offer_id},
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
                room_no: room.room_no,
                offer_id:room.offer_id || null,
                price_per_night: roomPrice
            })
        }

        //create booking
        const booking = await Booking.create(
            {
                customer_id,
                check_in_date,
                check_out_date,
                total_amount: total_amount,
                booking_date: new Date(),
            },
        )


        //create bookingdetails
        for(const detail of roomDetails){
            await BookingDetails.create({
                booking_id:booking.booking_id,
                room_no:detail.room_no,
                offer_id:detail.offer_id
            })
        }
        //     await sequelize.query(
        //         `INSERT INTO booking_details (booking_id, room_no, offer_id)
        //         VALUES(:booking_id, :room_no, :offer_id)`,
        //         {
        //             replacements: {
        //                 booking_id: booking.booking_id,
        //                 room_no: detail.room_no,
        //                 offer_id: detail.offer_id || null,
        //             },
        //             type: QueryTypes.INSERT
        //         }
        //     )
        //}

        await BookingHistory.create({
            customer_id,
            booking_id: booking.booking_id
        })
        // await sequelize.query(
        //     `INSERT INTO booking_history(customer_id, booking_id)
        //     VALUES(:customer_id, :booking_id)`,
        //     {
        //         replacements: {
        //             customer_id,
        //             booking_id:booking.booking_id
        //         },
        //         type: QueryTypes.INSERT
        //     }
        // )
        res.status(201).json(booking)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL booking
const getAllBooking = async (req,res) => {
    try{
        const [booking] = await sequelize.query(sqlBooking);
        res.json(booking)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single Customer
const getBookingByID = async(req,res) => {
    try{
        const [booking] = await sequelize.query(
            sqlBooking + `
            WHERE b.booking_id = :id
            `,
            {
            replacements:{id},
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

        await booking.update(req.body)
        res.json(booking)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Booking
const deleteBooking = async (req,res) => {
    try{
        const booking = await Booking.findByPk(req.params.id)
        if(!booking)
            return res.status(404).json({message: 'Booking not found'})
        await BookingDetails.destroy({ where: { booking_id: req.params.id } });
        await BookingHistory.destroy({ where: { booking_id: req.params.id } });
        await booking.destroy();
        res.json({message: 'Booking deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.createBooking = createBooking
exports.getAllBooking = getAllBooking
exports.getBookingByID = getBookingByID
exports.updateBooking = updateBooking
exports.deleteBooking = deleteBooking