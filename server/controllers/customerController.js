const {
  createCustomer,
  loginCustomer,
  getAllCustomers,
  getCustomerByID,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
} = require("../service/customerService");

// REGISTER CUSTOMER
const handleCreateCustomer = async (req, res) => {
  try {
    const customer = await createCustomer(req.body);
    res.status(201).json({
      message: "Customer registration successful",
      customer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN CUSTOMER
const handleCustomerLogin = async (req, res) => {
  try {
    const result = await loginCustomer(req.body, res);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// GET ALL CUSTOMERS
const handleGetAllCustomers = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const customers = await getAllCustomers(pageNumber, limit);
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET CUSTOMER BY ID
const handleGetCustomerByID = async (req, res) => {
  try {
    const customer = await getCustomerByID(req.params.id);
    res.json(customer);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

//Search customers
const handleSearchCustomers = async (req,res) => {
  try{
    const { search } = req.query;
    const customer = await searchCustomers(search);
    res.json(customer)
  }catch(err){
    res.status(500).json({error: err.message})
  }
}
// UPDATE CUSTOMER
const handleUpdateCustomer = async (req, res) => {
  try {
    const customer = await updateCustomer(req.params.id, req.body);
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE CUSTOMER
const handleDeleteCustomer = async (req, res) => {
  try {
    const message = await deleteCustomer(req.params.id);
    res.json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  handleCreateCustomer,
  handleCustomerLogin,
  handleGetAllCustomers,
  handleGetCustomerByID,
  handleUpdateCustomer,
  handleDeleteCustomer,
  handleSearchCustomers,
};
