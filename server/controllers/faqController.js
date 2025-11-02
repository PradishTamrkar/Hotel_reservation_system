const { createFAQ, getAllFAQ, getFAQByID, updateFAQ, deleteFAQ} = require('../service/faqServices')

//Create FAQ
const handleCreateFAQ = async (req,res) => {
    try{
        const faq = await createFAQ(req.body)
        res.status(201).json(faq)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//get all faq
const handleGetAllFAQ = async (req,res) => {
    try{
        const faq = await getAllFAQ();
        res.json(faq)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single FAQ
const handleGetFAQByID = async(req,res) => {
    try{
        const faq = await getFAQByID(req.params.id)
        res.json(faq)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  

//Update FAQ Info
const handleUpdateFAQ = async(req,res) => {
    try{
        const faq = await updateFAQ(req.params.id,req.body)
        res.json(faq)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete FAQ
const handleDeleteFAQ = async (req,res) => {
    try{
        const faq = await deleteFAQ(req.params.id)
        res.json({message: 'FAQ deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    handleCreateFAQ,
    handleGetAllFAQ,
    handleGetFAQByID,
    handleUpdateFAQ,
    handleDeleteFAQ
}