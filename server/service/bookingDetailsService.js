const { QueryError, QueryTypes } = require("sequelize")
const { db: sequelize } = require("../config/config");
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

//get all booking details
const getAllBookingDetails = async () => {
  const details = await sequelize.query(`${sqlBookingDetails}`, {
    type: QueryTypes.SELECT,
  });
  return details;
};

//get booking details by booking id
const getBookingDetailsByBookingID = async (booking_id) => {
  const details = await sequelize.query(
    `
    ${sqlBookingDetails}
    WHERE bd.booking_id = :booking_id
    `,
    {
      replacements: { booking_id },
      type: QueryTypes.SELECT,
    }
  );
  return details;
};

module.exports = {
    getAllBookingDetails,
    getBookingDetailsByBookingID
}