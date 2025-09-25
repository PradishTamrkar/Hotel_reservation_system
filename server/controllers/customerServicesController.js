const CustomerService = require("../models/customerServices")

//Customer Service Creation
const createCustomerService = async (req,res) => {
    try{
        const customerService = await CustomerService.create(req.body)
        res.status(201).json(customerService)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL Customers Services
const getAllCustomerService = async (req,res) => {
    try{
        const customerService = await CustomerService.findAll();
        res.json(customerService)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single Customer Service
const getCustomerServiceByID = async(req,res) => {
    try{
        const customerService = await CustomerService.findByPk(req.params.id)
        if(!customerService) 
            return res.status(404).json({message: 'Service not found'})
        res.json(customerService)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  

//Update Customer Service Info
const updateCustomerService = async(req,res) => {
    try{
        const customerService = await CustomerService.findByPk(req.params.id)
        if(!customerService)
            return res.status(404).json({message: 'Service not found'})

        await customerService.update(req.body)
        res.json(customerService)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Customer Service
const deleteCustomerService = async (req,res) => {
    try{
        const customerService = await CustomerService.findByPk(req.params.id)
        if(!customerService)
            return res.status(404).json({message: 'Service not found'})
        await customerService.destroy();
        res.json({message: 'Service deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.createCustomerService = createCustomerService
exports.getAllCustomerService = getAllCustomerService
exports.getCustomerServiceByID = getCustomerServiceByID
exports.updateCustomerService = updateCustomerService
exports.deleteCustomerService = deleteCustomerService