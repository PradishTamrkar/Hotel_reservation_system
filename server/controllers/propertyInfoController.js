const PropertyInfo = require("../models/propertyInfo")

//property information Creation
const createPropertyInfo = async (req,res) => {
    try{
        const propInformation = await PropertyInfo.create(req.body)
        res.status(201).json(propInformation)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL property information
const getAllPropertyInfo = async (req,res) => {
    try{
        const propInformation = await PropertyInfo.findAll();
        res.json(propInformation)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single Property Information
const getPropertyInfoByID = async(req,res) => {
    try{
        const propInformation = await PropertyInfo.findByPk(req.params.id)
        if(!propInformation) 
            return res.status(404).json({message: 'Property not found'})
        res.json(propInformation)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  

//Update Property Info
const updatePropertyInfo = async(req,res) => {
    try{
        const propInformation = await PropertyInfo.findByPk(req.params.id)
        if(!propInformation)
            return res.status(404).json({message: 'Property not found'})

        await propInformation.update(req.body)
        res.json(propInformation)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Property Info
const deletePropertyInfo = async (req,res) => {
    try{
        const propertyInfo = await PropertyInfo.findByPk(req.params.id)
        if(!propertyInfo)
            return res.status(404).json({message: 'Property not found'})
        await propertyInfo.destroy();
        res.json({message: 'Property deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.createPropertyInfo = createPropertyInfo
exports.getAllPropertyInfo = getAllPropertyInfo
exports.getPropertyInfoByID = getPropertyInfoByID
exports.updatePropertyInfo = updatePropertyInfo
exports.deletePropertyInfo = deletePropertyInfo