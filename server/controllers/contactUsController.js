const {
  createMessage,
  getAllMessages,
  getMessageByID,
  deleteMessage,
} = require("../service/contactUsService");

// CREATE MESSAGE
const handleCreateMessage = async (req, res) => {
  try {
    const message = await createMessage(req.body);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL MESSAGES
const handleGetAllMessages = async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET MESSAGE BY ID
const handleGetMessageByID = async (req, res) => {
  try {
    const message = await getMessageByID(req.params.id);
    res.json(message);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// DELETE MESSAGE
const handleDeleteMessage = async (req, res) => {
  try {
    const message = await deleteMessage(req.params.id);
    res.json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  handleCreateMessage,
  handleGetAllMessages,
  handleGetMessageByID,
  handleDeleteMessage,
};
