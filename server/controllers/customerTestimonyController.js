const {
  createCustomerTestimony,
  getAllTestimonies,
  getTestimonyByID,
  updateTestimony,
  deleteTestimony,
  getFeaturedTestimonies,
  toggleFeatured,
} = require("../service/customerTestimonyService");

// create testimony
const handleCreateCustomerTestimony = async (req, res) => {
  try {
    const testimony = await createCustomerTestimony(req.body, req.user);
    res.status(201).json(testimony);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all testimony
const handleGetAllCustomerTestimonies = async (req, res) => {
  try {
    const testimonies = await getAllTestimonies();
    res.json(testimonies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get featured testionies
const handleGetFeaturedTestimonies = async (req, res) => {
    try {
        const testimonies = await getFeaturedTestimonies();
        res.json(testimonies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//toggle featured
const handleToggleFeaturedTestimony = async (req, res) => {
    try {
        const testimony = await toggleFeatured(req.params.id);
        res.json({ message: 'Featured status updated', testimony });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// get testimony by id
const handleGetCustomerTestimonyByID = async (req, res) => {
  try {
    const testimony = await getTestimonyByID(req.params.id);
    res.json(testimony);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// update testimony
const handleUpdateCustomerTestimony = async (req, res) => {
  try {
    const testimony = await updateTestimony(req.params.id, req.body,req.user);
    res.json(testimony);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete testimony
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
  handleGetFeaturedTestimonies,
  handleToggleFeaturedTestimony
};
