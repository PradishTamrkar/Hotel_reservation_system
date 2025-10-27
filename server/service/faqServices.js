const FAQ = require("../models/faq")

//Customer FAQ
const createFAQ = async (data) => {
    const faq = await FAQ.create(data)
    return faq
}

//GET ALL FAQ
const getAllFAQ = async () => {
    const faq = await FAQ.findAll();
    return faq
}

//GET single FAQ
const getFAQByID = async(id) => {

    const faq = await FAQ.findByPk(id)
    if(!faq) 
        throw new Error('FAQ not found')
    return (faq)
}

//Update FAQ Info
const updateFAQ = async(id,data) => {
    
    const faq = await FAQ.findByPk(id)
    if(!faq) 
        throw new Error('FAQ not found')

    await faq.update(data)
    return (faq)
}

//Delete FAQ
const deleteFAQ = async (id) => {

    const faq = await FAQ.findByPk(id)
    if(!faq) 
        throw new Error('FAQ not found')
    await faq.destroy()
    return ('FAQ deleted successfully')
}

module.exports = {
    createFAQ,
    getAllFAQ,
    getFAQByID,
    updateFAQ,
    deleteFAQ
}