const Admin = require('../models/admin')
const { generateToken } = require('../service/auth')
const {hashedPass, compPass} = require('../service/passwordService')
//admin creation or registration
const createAdmin = async(req,res) => {
    try{
        const { admin_username, admin_email, admin_password, contact_no  } = req.body
        const hashedPassword = await hashedPass(admin_password)
        const admin = await Admin.create({
            admin_username, 
            admin_email,
            admin_password:hashedPassword,
            contact_no
        })
        await admin.save();
        res.status(201).json({message:'Admin resgitration successfull'})
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//admin login
const adminLogin = async(req,res) => {
    try{
        const {admin_username, admin_password } = req.body
        const admin = await Admin.findOne({where:{admin_username}})
        if(!admin)
            return res.status(401).json({message: 'Not Admin. Access Denied'})
        const adminPassCheck = await compPass(admin_password, admin.admin_password)
        if(!adminPassCheck)
            return res.status(401).json('Password not matched')
        const token = generateToken({id: admin.admin_id, role: 'admin'})

        res.json({message:'Login Successful', token})
    }catch(err){
        res.status(500).json({error:err.message})
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
        const admin = await Admin.findByPk(req.params.id)
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
        const admin = await Admin.findByPk(req.params.id)
        if(!admin)
            return res.status(404).json({message: 'Admin not found'})
        await admin.destroy();
        res.json({message: 'admin deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.createAdmin = createAdmin
exports.adminLogin = adminLogin
exports.getAdmin = getAdmin
exports.getAdminByID = getAdminByID
exports.updateAdmin = updateAdmin
exports.deleteAdmin = deleteAdmin
