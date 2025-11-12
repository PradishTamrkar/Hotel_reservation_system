const FAQ = require("../models/faq")


const sqlFiveFaq = 
`
SELECT 
    faq_id,
    faq_questions,
    faq_answers,
FROM faq f
`

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

//GetFeaturedFAQs;
const getFeaturedFAQs = async () => {
    const faq = await FAQ.findAll({
        where:{is_featured: true},
        limit: 5,
        order: [['faq_id', 'DESC']]
    })
    return faq
}

const toggleFeatured =async (id) => {
    const faq = await FAQ.findByPk(id)
    if (!faq) throw new Error('FAQ not found');
    
    if (!faq.is_featured) {
        const featuredCount = await FAQ.count({ where: { is_featured: true } });
        if (featuredCount >= 5) {
            throw new Error('Maximum 5 FAQs can be featured');
        }
    }

    await faq.update({is_featured: !faq.is_featured})
    return faq;
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
    deleteFAQ,
    getFeaturedFAQs,
    toggleFeatured,
}