const {
  createMessage,
  getAllMessages,
  getMessageByID,
  deleteMessage,
} = require("../service/contactUsService");

// create message
const handleCreateMessage = async (req, res) => {
  try {
    const message = await createMessage(req.body);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all message
const handleGetAllMessages = async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get message by id
const handleGetMessageByID = async (req, res) => {
  try {
    const message = await getMessageByID(req.params.id);
    res.json(message);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// delete message
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
