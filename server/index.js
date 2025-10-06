require('dotenv').config()
const express = require('express')
const sequelize = require('./config/db')
const customerRoutes = require('./routes/customerRoutes')
const roomRoutes = require('./routes/roomRoutes')
const adminRoutes = require('./routes/adminRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const roomAmenitiesRoutes = require('./routes/roomAmenityRoutes')
const promosAndOffersRoutes = require('./routes/promosAndOfferRoutes')
const faqRoutes = require('./routes/faqRoutes')
const customerTestimonyRoutes = require('./routes/customerTestimonyRoutes')
const customerServiceRoutes = require('./routes/customerServiceRoutes')
const contactUsRoutes = require('./routes/contactUsRoutes')
const propertyInfoRoutes = require('./routes/propertyInfoRoutes')
const hotelAmenityRoutes = require('./routes/hotelAmenityRoutes')
const bookingDetailsRoutes = require('./routes/bookingDetailsRoutes')
const bookingHistoryRoutes = require('./routes/bookingHistoryRoutes')

const app = express()           

app.use(express.json())        
app.use('/api/customers', customerRoutes) 
app.use('/api/rooms', roomRoutes) 
app.use('/api/admin', adminRoutes)
app.use('/api/booking',bookingRoutes)
app.use('/api/roomAmenities',roomAmenitiesRoutes)
app.use('/api/promosAndOffer',promosAndOffersRoutes)
app.use('/api/faq', faqRoutes)
app.use('/api/testimony', customerTestimonyRoutes)
app.use('/api/customerServices', customerServiceRoutes)
app.use('/api/contactUs', contactUsRoutes)
app.use('/api/property', propertyInfoRoutes)
app.use('/api/hotelAmenities', hotelAmenityRoutes)
app.use('/api/bookingDetails', bookingDetailsRoutes)
app.use('/api/bookingHistory', bookingHistoryRoutes)

;(async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ alter:true })
    console.log('database synchronized')
  } catch (err) {
    console.error('Synchronization failed: ', err)
  }
})()

const PORT = process.env.PORT || 3002
app.listen(PORT, () => console.log(`The Server is running on port ${PORT}`))