const FAQ = require("../models/faq")

//Customer FAQ
const createFAQ = async (req,res) => {
    try{
        const faq = await FAQ.create(req.body)
        res.status(201).json(faq)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL FAQ
const getAllFAQ = async (req,res) => {
    try{
        const faq = await FAQ.findAll();
        res.json(faq)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single FAQ
const getFAQByID = async(req,res) => {
    try{
        const faq = await FAQ.findByPk(req.params.id)
        if(!faq) 
            return res.status(404).json({message: 'FAQ not found'})
        res.json(faq)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  

//Update FAQ Info
const updateFAQ = async(req,res) => {
    try{
        const faq = await FAQ.findByPk(req.params.id)
        if(!faq)
            return res.status(404).json({message: 'FAQ not found'})

        await faq.update(req.body)
        res.json(faq)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete FAQ
const deleteFAQ = async (req,res) => {
    try{
        const faq = await FAQ.findByPk(req.params.id)
        if(!faq)
            return res.status(404).json({message: 'FAQ not found'})
        await faq.destroy();
        res.json({message: 'FAQ deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.createFAQ = createFAQ
exports.getAllFAQ = getAllFAQ
exports.getFAQByID = getFAQByID
exports.updateFAQ = updateFAQ
exports.deleteFAQ = deleteFAQ