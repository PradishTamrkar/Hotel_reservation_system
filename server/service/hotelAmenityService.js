const HotelAmenity = require("../models/hotelAmenities")

//Create Hotel Amenity
const createHotelAmenity = async (data,file) => {

    const { hotel_amenity_name,hotel_amenity_description } = data
    if (!hotel_amenity_name || !hotel_amenity_description )
        throw new Error("All fields are required" );

    const hotel_amenity_image = file ? file.path : null

    const newHotelAmenity = await HotelAmenity.create({
        hotel_amenity_name,
        hotel_amenity_description,
        hotel_amenity_image
    })

    return newHotelAmenity    
}

//GET ALL Hotel Amenity
const getAllHotelAmenity= async () => {
    const hotelAmenity = await HotelAmenity.findAll();
    return hotelAmenity
}

//get hotel Amenity By ID
const getHotelAmenityByID = async(id) => {
    const hotelAmenity = await HotelAmenity.findByPk(id)
    if(!hotelAmenity) 
        throw new Error('Hotel Amenity not found')
    return hotelAmenity
}

//updaate hotel amenities:
const updateHotelAmenity= async(id,data,file) => {

    const { hotel_amenity_name,hotel_amenity_description } = data

    const hotelAmenity = await HotelAmenity.findByPk(id)
    if(!hotelAmenity)
        throw new Error('Hotel Amenity not found')

    const hotel_amenity_image = file ? file.path : hotelAmenity.hotel_amenity_image

    await hotelAmenity.update({
        hotel_amenity_name,
        hotel_amenity_description,
        hotel_amenity_image
    })

    return{message: "Hotel Amenity updated successfully",hotelAmenity}
}

//delete hotel amenities
const deleteHotelAmenity =  async (id) => {

    const hotelAmenity = await HotelAmenity.findByPk(id)
    if(!hotelAmenity)
        throw new Error('Hotel Amenity not found')
    await hotelAmenity.destroy();
    return('Hotel Amenity deleted successfully')
}

module.exports = {
    createHotelAmenity,
    getAllHotelAmenity,
    getHotelAmenityByID,
    updateHotelAmenity,
    deleteHotelAmenity
}
