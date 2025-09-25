const ContactUs = require("../models/contactUs")

//Message Creation
const createMessage = async (req,res) => {
    try{
        const messages = await ContactUs.create(req.body)
        res.status(201).json(messages)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL Message
const getAllMessage = async (req,res) => {
    try{
        const messages = await ContactUs.findAll();
        res.json(messages)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single Message
const getMessageByID = async(req,res) => {
    try{
        const messages = await ContactUs.findByPk(req.params.id)
        if(!messages) 
            return res.status(404).json({message: 'Message not found'})
        res.json(messages)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  


//Delete Message
const deleteMessage = async (req,res) => {
    try{
        const messages = await ContactUs.findByPk(req.params.id)
        if(!messages)
            return res.status(404).json({message: 'Message not found'})
        await messages.destroy();
        res.json({message: 'Message deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.createMessage = createMessage
exports.getAllMessage = getAllMessage
exports.getMessageByID = getMessageByID
exports.deleteMessage = deleteMessage