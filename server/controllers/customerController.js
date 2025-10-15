const { QueryTypes } = require("sequelize")
const sequelize = require("../config/db")
const Customer = require("../models/customer")
const { generateToken, sendAuthCookie } = require('../service/auth')
const {hashedPass, compPass} = require('../service/passwordService')
const customer = require("../models/customer")

//Customer JOINS
const sqlCustomer = `
SELECT
    c.customer_id, 
    c.first_name || COALESCE(' ' || c.middle_name, '') || ' ' || c.last_name AS customer_name, 
    c.email AS customer_email,
    c.phone_no
FROM customer c
`
//Customer Creation/registration
const createCustomer = async (req,res) => {
    try{
        const {first_name, middle_name, last_name, email, customer_username, customer_password, gender, phone_no, address, nationality, citizenship_id} = req.body
        if(!first_name || !last_name || !email || !gender || !phone_no || !address || !nationality || !citizenship_id)
            return res.status(400).json({message: "missing required fields"})

        //password hashing
        const hashedPasswordCus = await hashedPass(customer_password)

        //check if guest data already exists
        const existingGuest = await Customer.findOne({
            where: {
                email, 
                phone_no, 
                guest_check_out: true
            }
        })

        if(existingGuest){
            //to update guest to registered customer
            existingGuest.customer_username = customer_username
            existingGuest.customer_password = hashedPasswordCus
            existingGuest.guest_check_out = false;

            //to update any other info
            existingGuest.first_name = first_name
            existingGuest.middle_name = middle_name
            existingGuest.last_name = last_name
            existingGuest.address = address
            existingGuest.nationality = nationality
            existingGuest.citizenship_id = citizenship_id
            existingGuest.gender = gender

            await existingGuest.save()

            return res.status(200).json({
                message:"Customer resgitration successfull",
                customer: existingGuest
            })
        }
       
        const newCustomer = await Customer.create({ 
            first_name, 
            middle_name, 
            last_name, 
            email,
            customer_username, 
            customer_password: hashedPasswordCus, 
            gender, 
            phone_no, 
            address,
            nationality,
            citizenship_id,
            guest_check_out: false
        });

        res.status(201).json({
            message:'Customer resgitration successfull',
            customer: newCustomer
        })
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
        sendAuthCookie(res,token)
        
        res.json({message:'Login Successful', token})
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

//GET ALL Customers
const getAllCustomer = async (req,res) => {
    try{
        const pageNumber = parseInt(req.query.pageNumber) || 1
        const limit = parseInt(req.query.limit) || 10
        const offset = (pageNumber -1 ) * limit 
        const [customer] = await sequelize.query(
            `
            ${sqlCustomer}
                ORDER BY c.customer_id
                LIMIT :limit OFFSET :offset
                `,
                {
                    replacements:{limit,offset},
                    type:QueryTypes.SELECT
                }
            )
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