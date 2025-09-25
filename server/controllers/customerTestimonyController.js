const sequelize = require("../config/db")
const CustomerTestimony = require("../models/customerTestimony")

//Testimony JOINS
const sqlTestimony = `
    SELECT 
        t.testimony_id,
        t.comment,
        t.rating,
        c.customer_id,
        c.first_name || ' ' || c.middle_name || ' ' || c.last_name AS customer_name
    FROM customer_testimonies t
    JOIN customer c ON t.customer_id = c.customer_id
`
//Testimony Creation
const createCustomerTestimony = async (req,res) => {
    try{
        const customerTestimony = await CustomerTestimony.create(req.body)
        res.status(201).json(customerTestimony)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL Customers Testimony
const getAllCustomersTestimony = async (req,res) => {
    try{
        const [customerTestimony] = await sequelize.query(sqlTestimony);
        res.json(customerTestimony)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single Customer Testimony
const getCustomerTestimonyByID = async(req,res) => {
    try{
        const [customerTestimony] = await sequelize.query(
            sqlTestimony + `WHERE t.testimony_id = :id`
        )
        if(!customerTestimony) 
            return res.status(404).json({message: 'Customer Testimony not found'})
        res.json(customerTestimony)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  

//Update Customer Testimony Info
const updateCustomerTestimony = async(req,res) => {
    try{
        const customerTestimony = await CustomerTestimony.findByPk(req.params.id)
        if(!customerTestimony)
            return res.status(404).json({message: 'Customer Testimony not found'})

        await customerTestimony.update(req.body)
        res.json(customerTestimony)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Customer Testimony
const deleteCustomerTestimony = async (req,res) => {
    try{
        const customerTestimony = await CustomerTestimony.findByPk(req.params.id)
        if(!customerTestimony)
            return res.status(404).json({message: 'Customer Testimony not found'})
        await customerTestimony.destroy();
        res.json({message: 'Customer Testimony deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.createCustomerTestimony = createCustomerTestimony
exports.getAllCustomersTestimony = getAllCustomersTestimony
exports.getCustomerTestimonyByID = getCustomerTestimonyByID
exports.updateCustomerTestimony = updateCustomerTestimony
exports.deleteCustomerTestimony = deleteCustomerTestimony