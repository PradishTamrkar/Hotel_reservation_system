const { QueryTypes } = require("sequelize");
const { db: sequelize } = require("../config/config");
const Customer = require("../models/customer");
const { generateToken, sendAuthCookie } = require("../middlewares/auth");
const { hashedPass, compPass } = require("../service/passwordService");

const sqlCustomer = `
SELECT
  c.customer_id, 
  c.first_name || COALESCE(' ' || c.middle_name, '') || ' ' || c.last_name AS customer_name, 
  c.email AS customer_email,
  c.phone_no
FROM customer c
`;

// create customer
const createCustomer = async (data) => {
  const {
    first_name,
    middle_name,
    last_name,
    email,
    customer_username,
    customer_password,
    gender,
    phone_no,
    address,
    nationality,
    citizenship_id,
  } = data;

  if (!first_name || !last_name || !email || !gender || !phone_no || !address || !nationality || !citizenship_id)
    throw new Error("Missing required fields");

  const hashedPasswordCus = await hashedPass(customer_password);

  const existingGuest = await Customer.findOne({
    where: { email, phone_no, guest_check_out: true },
  });

  if (existingGuest) {
    Object.assign(existingGuest, {
      customer_username,
      customer_password: hashedPasswordCus,
      guest_check_out: false,
      first_name,
      middle_name,
      last_name,
      address,
      nationality,
      citizenship_id,
      gender,
    });
    await existingGuest.save();
    return existingGuest;
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
    guest_check_out: false,
  });

  return newCustomer;
};

// customer login
const loginCustomer = async (data, res) => {
  const { customer_username, customer_password } = data;
  const customer = await Customer.findOne({ where: { customer_username } });

  if (!customer) throw new Error("Customer Authentication Failed");
  const passMatch = await compPass(customer_password, customer.customer_password);
  if (!passMatch) throw new Error("Password not matched");

  const token = generateToken({ id: customer.customer_id, role: "customer" });
  sendAuthCookie(res, token);

  return { message: "Login Successful", token };
};

// get all customers
const getAllCustomers = async (pageNumber = 1, limit = 10) => {
  const offset = (pageNumber - 1) * limit;
  const customers = await sequelize.query(
    `${sqlCustomer} ORDER BY c.customer_id LIMIT :limit OFFSET :offset`,
    {
      replacements: { limit, offset },
      type: QueryTypes.SELECT,
    }
  );
  return customers;
};

// get customer by id
const getCustomerByID = async (id) => {
  const customer = await sequelize.query(`${sqlCustomer} WHERE c.customer_id = :id`, {
    replacements: { id },
    type: QueryTypes.SELECT,
  });
  if (!customer.length) throw new Error("Customer not found");
  return customer[0];
};

// update customer
const updateCustomer = async (id, data) => {
  const customer = await Customer.findByPk(id);
  if (!customer) throw new Error("Customer not found");
  await customer.update(data);
  return customer;
};

// delete customer
const deleteCustomer = async (id) => {
  const customer = await Customer.findByPk(id);
  if (!customer) throw new Error("Customer not found");
  await customer.destroy();
  return "Customer deleted successfully";
};

module.exports = {
  createCustomer,
  loginCustomer,
  getAllCustomers,
  getCustomerByID,
  updateCustomer,
  deleteCustomer,
};
