const {
  createCustomerTestimony,
  getAllTestimonies,
  getTestimonyByID,
  updateTestimony,
  deleteTestimony,
} = require("../service/customerTestimonyService");

// CREATE TESTIMONY
const handleCreateCustomerTestimony = async (req, res) => {
  try {
    const testimony = await createCustomerTestimony(req.body, req.user);
    res.status(201).json(testimony);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL TESTIMONIES
const handleGetAllCustomerTestimonies = async (req, res) => {
  try {
    const testimonies = await getAllTestimonies();
    res.json(testimonies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET TESTIMONY BY ID
const handleGetCustomerTestimonyByID = async (req, res) => {
  try {
    const testimony = await getTestimonyByID(req.params.id);
    res.json(testimony);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// UPDATE TESTIMONY
const handleUpdateCustomerTestimony = async (req, res) => {
  try {
    const testimony = await updateTestimony(req.params.id, req.body,req.user);
    res.json(testimony);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE TESTIMONY
const handleDeleteCustomerTestimony = async (req, res) => {
  try {
    const message = await deleteTestimony(req.params.id);
    res.json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  handleCreateCustomerTestimony,
  handleGetAllCustomerTestimonies,
  handleGetCustomerTestimonyByID,
  handleUpdateCustomerTestimony,
  handleDeleteCustomerTestimony,
};
