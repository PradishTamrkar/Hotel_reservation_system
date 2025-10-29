const { QueryError, QueryTypes } = require("sequelize")
const { db: sequelize } = require("../config/config");
const AmenityBridge = require("../models/amenityBridge")

const sqlAllBridge = (
    `
    SELECT 
        ab.catagory_amenity_id,
        rc.room_catagory_id,
        rc.room_catagory_name,
        ra.room_amenity_id,
        ra.room_amenity_name
    FROM amenity_bridge ab
    LEFT JOIN room_catagory rc ON ab.room_catagory_id = rc.room_catagory_id
    LEFT JOIN room_amenity ra ON ab.room_amenity_id = ra.room_amenity_id
    ORDER BY ab.catagory_amenity_id;
    `
)

const sqlAmenityByCatagoryID = (
    `
    SELECT 
        ra.room_amenity_id,
        ra.room_amenity_name,
        ra.room_amenity_description
    FROM amenity_bridge ab
    LEFT JOIN room_amenity ra ON ab.room_amenity_id = ra.room_amenity_id
    `
)

// create bridge
const createAmenityBridge = async ( room_catagory_id, room_amenity_id) => {

        if(!room_catagory_id || !room_amenity_id )
            throw new Error('room_catagory_id & room_amenity_id are required')
        
        const [amenityBridge] = await sequelize.query(
            `
            INSERT INTO amenity_bridge (room_catagory_id, room_amenity_id)
            VALUES (:room_catagory_id, :room_amenity_id)
            RETURNING *
            `,{
                replacements: {room_catagory_id,room_amenity_id},
                type:QueryTypes.INSERT
            }
        )
        return amenityBridge
}

//get all bridge
const getAllAmenityBridge = async () => {

    const amenityBridge = await sequelize.query(
            `
            ${sqlAllBridge}
            `,
            {
                type:QueryTypes.SELECT
            }
        )
        return amenityBridge
}

//get amenities inside one catagory
const getAmenitiesByCategory = async (categoryId) => {

    const amenities = await sequelize.query(
      `
      ${sqlAmenityByCatagoryID}
      WHERE ab.room_catagory_id = :id;
      `,
      { replacements: { id: categoryId }, type: QueryTypes.SELECT }
    );
    return (amenities);
}

//update amenity bridge
const updateAmenityBridge= async(id,data) => {

        const amenityBridge = await AmenityBridge.findByPk(id)
        if(!amenityBridge)
            throw new Error('Amenity Bridge not found')

        await amenityBridge.update(data)
        return amenityBridge
}

//delete amenity bridge
const deleteAmenityBridge = async (id) => {
        const amenityBridge = await AmenityBridge.findByPk(id)
        if(!amenityBridge)
            throw new Error('Amenity Bridge not found')
        await amenityBridge.destroy();
        return({message: 'Amenity Bridge deleted successfully'})
}

module.exports = {
    createAmenityBridge,
    getAllAmenityBridge,
    getAmenitiesByCategory,
    updateAmenityBridge,
    deleteAmenityBridge
}