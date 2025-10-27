const ContactUs = require("../models/contactUs");

// create message
const createMessage = async (data) => {
  const message = await ContactUs.create(data);
  return message;
};

// get all message
const getAllMessages = async () => {
  const messages = await ContactUs.findAll();
  return messages;
};

// get message by id
const getMessageByID = async (id) => {
  const message = await ContactUs.findByPk(id);
  if (!message) throw new Error("Message not found");
  return message;
};

// delete message
const deleteMessage = async (id) => {
  const message = await ContactUs.findByPk(id);
  if (!message) throw new Error("Message not found");
  await message.destroy();
  return "Message deleted successfully";
};

module.exports = {
  createMessage,
  getAllMessages,
  getMessageByID,
  deleteMessage,
};
