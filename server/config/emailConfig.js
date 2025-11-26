const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

const createTransporter = () => {
    if(process.env.NODE_ENV === 'production'){
        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port:465,
            secure:true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000
        })
    }else{
        return nodemailer.createTransport({
            host:process.env.EMAIL_HOST || 'smtp.ethereal.email',
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            }
        })

    }
}

const transporter = createTransporter()

transporter.verify((error,success) => {
    if(error)
        console.log('Email transporter error:',error)
    else
        console.log('Email service is ready')
})

module.exports = transporter