const { QueryError, QueryTypes } = require("sequelize")
const sequelize = require("../config/db")
const CustomerTestimony = require("../models/customerTestimony")

//Testimony JOINS
const sqlTestimony = `
    SELECT
        t.comment,
        t.rating,
        c.first_name || COALESCE(' ' || c.middle_name, '') || ' ' || c.last_name AS customer_name
    FROM customer_testimonies t
    JOIN customer c ON t.customer_id = c.customer_id
`
//Testimony Creation
const createCustomerTestimony = async (req,res) => {
    try{
        const { comment,rating } =req.body
        const customer_id = req.user.id

        if(!comment)
            return res.status(400).json({message: "Comment is required"})

        if(!req.user || !req.user.role === "customer")
            return res.status(401).json({message: "Only registered customer can post testimonies"})
        
        const [customer] = await sequelize.query(
            `
            SELECT
                first_name,
                middle_name,
                last_name
            FROM customer 
            WHERE customer_id= :id
            `,{
                replacements:{id: req.user.id},
                type:QueryTypes.SELECT
            }
        )

        if(!customer){
            return res.status(404).json({message: "Customer not found"})
        }

        const customerTestimony = await CustomerTestimony.create({
            comment,
            rating,
            customer_id,
            first_name: customer.first_name,
            middle_name: customer.middle_name,
            last_name: customer.last_name
        }
        )
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