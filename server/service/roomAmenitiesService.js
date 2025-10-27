const RoomAmenity = require("../models/roomAmenities")

//Amenity Creation
const createRAmenity = async (data) => {

    const rAmenity = await RoomAmenity.create(data)
    return rAmenity
}

//get all amenities
const getAllRAmenity = async () => {

        const rAmenity = await RoomAmenity.findAll();
        return rAmenity
}

//get one amenity
const getRAmenityByID = async(id) => {

    const rAmenity = await RoomAmenity.findByPk(id)
    if(!rAmenity) 
        throw new Error('Room Amenity not found')
    return rAmenity
}

//update Room Amenity
const updateRAmenity = async(id,data) => {
    const rAmenity = await RoomAmenity.findByPk(id)
    if(!rAmenity) 
        throw new Error('Room Amenity not found')

    await rAmenity.update(data)
    return rAmenity
}

//delete Room Amenity
const deleteRAmenity = async(id) => {
    const rAmenity = await RoomAmenity.findByPk(id)
    if(!rAmenity)
        throw new Error('Room Amenity not foung')

    await rAmenity.destroy()
    return ('Room Amenity deleted successfully')
}

module.exports = {
    createRAmenity,
    getAllRAmenity,
    getRAmenityByID,
    updateRAmenity,
    deleteRAmenity
}