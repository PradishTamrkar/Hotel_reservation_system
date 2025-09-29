const { QueryTypes } = require("sequelize")
const sequelize = require("../config/db")
const Customer = require("../models/customer")
const { generateToken } = require('../service/auth')
const {hashedPass, compPass} = require('../service/passwordService')

//Customer JOINS
const sqlCustomer = `
SELECT
    c.customer_id, 
    c.first_name || ' ' || c.middle_name || ' ' || c.last_name AS customer_name, 
    c.email AS customerEmail,
    c.phone_no,
    b.booking_id, 
    b.booking_date, 
    b.check_in_date, 
    b.check_out_date, 
    b.total_amount,
    bd.booking_details_id,
    r.room_no,
    r.room_type,
    r.price_per_night
FROM customer c
LEFT JOIN booking b ON c.customer_id = b.customer_id
LEFT JOIN booking_details bd on b.booking_id = bd.booking_id
LEFT JOIN room r ON bd.room_no = r.room_no
`
//Customer Creation/registration
const createCustomer = async (req,res) => {
    try{
        const {first_name, middle_name, last_name, email, customer_username, customer_password, gender, phone_no, address} = req.body
        const hashedPasswordCus = await hashedPass(customer_password)
        const customer = await Customer.create({ first_name, middle_name, last_name, email, customer_username, customer_password: hashedPasswordCus, gender, phone_no, address});
        res.status(201).json({message:'Customer resgitration successfull'})
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//customer login
const customerLogin = async(req,res) => {
    try{
        const {customer_username, customer_password } = req.body
        const customer = await Customer.findOne({where:{customer_username}})
        if(!customer)
            return res.status(401).json({message: 'Customer Authentication Failed'})
        const cusPassCheck = await compPass(customer_password, customer.customer_password)
        if(!cusPassCheck)
            return res.status(401).json('Password not matched')
        const token = generateToken({id: customer.customer_id, role: 'customer'})

        res.json({message:'Login Successful', token})
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

//GET ALL Customers
const getAllCustomer = async (req,res) => {
    try{
        const [customer] = await sequelize.query(sqlCustomer);
        res.json(customer)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single Customer
const getCustomersByID = async(req,res) => {
    try{
        const customer = await sequelize.query(
            sqlCustomer+`WHERE c.customer_id = :id`,
            {
                replacements: {id:req.params.id},
                type: QueryTypes.SELECT
            }
            
        )
        if(!customer) 
            return res.status(404).json({message: 'Customer not found'})
        res.json(customer)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  

//Update Customer Info
const updateCustomer = async(req,res) => {
    try{
        const customer = await Customer.findByPk(req.params.id)
        if(!customer)
            return res.status(404).json({message: 'Customer not found'})

        await customer.update(req.body)
        res.json(customer)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Customer
const deleteCustomer = async (req,res) => {
    try{
        const customer = await Customer.findByPk(req.params.id)
        if(!customer)
            return res.status(404).json({message: 'Customer not found'})
        await customer.destroy();
        res.json({message: 'Customer deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.createCustomer = createCustomer
exports.getAllCustomer = getAllCustomer
exports.getCustomersByID = getCustomersByID
exports.updateCustomer = updateCustomer
exports.deleteCustomer = deleteCustomer
exports.customerLogin = customerLogin