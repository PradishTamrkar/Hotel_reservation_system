const { env, db: sequelize } = require('./config/config');
const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')


const customerRoutes = require('./routes/customerRoutes')
const roomRoutes = require('./routes/roomRoutes')
const adminRoutes = require('./routes/adminRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const roomAmenitiesRoutes = require('./routes/roomAmenityRoutes')
const promosAndOffersRoutes = require('./routes/promosAndOfferRoutes')
const faqRoutes = require('./routes/faqRoutes')
const customerTestimonyRoutes = require('./routes/customerTestimonyRoutes')
const contactUsRoutes = require('./routes/contactUsRoutes')
const hotelAmenityRoutes = require('./routes/hotelAmenityRoutes')
const bookingDetailsRoutes = require('./routes/bookingDetailsRoutes')
const roomCatagoryRoutes = require('./routes/roomCatagoryRoutes')
const amenityBridgeRoutes = require('./routes/amenityBridgeRoutes')

const app = express()           

app.use(express.json())  
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://hotel-himalayas-dyodvkw6z-pradish-tamrakars-projects.vercel.app',
    'https://*.vercel.app',
  ],
  credentials: true,
  methods: ['GET','Post','PUT','DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))      
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/customers', customerRoutes) 
app.use('/api/rooms', roomRoutes) 
app.use('/api/admin', adminRoutes)
app.use('/api/booking',bookingRoutes)
app.use('/api/roomAmenities',roomAmenitiesRoutes)
app.use('/api/promosAndOffer',promosAndOffersRoutes)
app.use('/api/faq', faqRoutes)
app.use('/api/testimony', customerTestimonyRoutes)
app.use('/api/contactUs', contactUsRoutes)
app.use('/api/hotelAmenities', hotelAmenityRoutes)
app.use('/api/bookingDetails', bookingDetailsRoutes)
app.use('/api/roomCatagory',roomCatagoryRoutes)
app.use('/api/amenityBridge',amenityBridgeRoutes)


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
app.listen(PORT, "0.0.0.0",() => console.log(`The Server is running on port ${PORT}`))