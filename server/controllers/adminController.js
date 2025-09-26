const Admin = require('../models/admin')

//admin creation
const createAdmin = async(req,res) => {
    try{
        const admin = await Admin.create(req.body)
        res.status(201).json(admin)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//Get all Admin
const getAdmin = async (req,res) => {
    try{
        const admin = await Admin.findAll()
        if(!admin) 
            return res.status(404).json({message: 'Admin not found'})
        res.json(admin)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET single Admin
const getAdminByID = async(req,res) => {
    try{
        const admin = await Admin.findByPk(req.params.id)
        if(!admin) 
            return res.status(404).json({message: 'Admin not found'})
        res.json(admin)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}
//Update Admin
const updateAdmin = async(req,res) => {
    try{
        const admin = await Admin.findAll()
        if(!admin) 
            return res.status(404).json({message: 'Admin not found'})
        await admin.update(req.body)
        res.json(admin)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//Delete Room
const deleteAdmin = async (req,res) => {
    try{
        const admin = await Admin.findOne()
        if(!admin)
            return res.status(404).json({message: 'Admin not found'})
        await admin.destroy();
        res.json({message: 'admin deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.createAdmin = createAdmin
exports.getAdmin = getAdmin
exports.getAdminByID = getAdminByID
exports.updateAdmin = updateAdmin
exports.deleteAdmin = deleteAdmin
