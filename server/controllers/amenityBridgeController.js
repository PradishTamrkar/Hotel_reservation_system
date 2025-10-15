const { QueryError, QueryTypes } = require("sequelize")
const sequelize = require("../config/db")
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
//Amenity Bridge Creation
const createAmenityBridge = async (req,res) => {
    try{
        const {room_catagory_id, room_amenity_id} = req.body

        if(!room_catagory_id || !room_amenity_id )
            return res.status(400).json({message: 'room_catagory_id & room_amenity_id are required'})
        const amenityBridge = await sequelize.query(
            `
            INSERT INTO amenity_bridge (room_catagory_id, room_amenity_id)
            VALUES (:room_catagory_id, :room_amenity_id)
            RETURNING *
            `,{
                replacements: {room_catagory_id,room_amenity_id},
                type:QueryTypes.INSERT
            }
        )
        res.status(201).json({message:'bridge created successfully'},amenityBridge)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL Booking Details
const getAllAmenityBridge = async (req,res) => {
    try{
        const amenityBridge = await sequelize.query(
            `
            ${sqlAllBridge}
            `,
            {
                type:QueryTypes.SELECT
            }
        )
        res.json(amenityBridge)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//see amenities inside one catagory
const getAmenitiesByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const amenities = await sequelize.query(
      `
      ${sqlAmenityByCatagoryID}
      WHERE ab.room_catagory_id = :id;
      `,
      { replacements: { id }, type: QueryTypes.SELECT }
    );

    res.json(amenities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};  

//Update Bookoing Details Info
const updateAmenityBridge= async(req,res) => {
    try{
        const amenityBridge = await AmenityBridge.findByPk(req.params.id)
        if(!amenityBridge)
            return res.status(404).json({message: 'BAmenity Bridge not found'})

        await amenityBridge.update(req.body)
        res.json(amenityBridge)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Booking Details
const deleteAmenityBridge = async (req,res) => {
    try{
        const amenityBridge = await AmenityBridge.findByPk(req.params.id)
        if(!amenityBridge)
            return res.status(404).json({message: 'Amenity Bridge not found'})
        await amenityBridge.destroy();
        res.json({message: 'Amenity Bridge deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.createAmenityBridge= createAmenityBridge
exports.getAllAmenityBridge= getAllAmenityBridge
exports.getAmenitiesByCategory = getAmenitiesByCategory
exports.updateAmenityBridge = updateAmenityBridge
exports.deleteAmenityBridge = deleteAmenityBridge