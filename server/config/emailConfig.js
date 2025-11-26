const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const createTransporter = () => {
    // Use SendGrid in production if API key is available
    if (process.env.NODE_ENV === 'production' && process.env.SENDGRID_API_KEY) {
        console.log('📧 Using SendGrid for email service');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        // Return a transporter-compatible object for SendGrid
        return {
            sendMail: async (mailOptions) => {
                const msg = {
                    to: mailOptions.to,
                    from: {
                        email: process.env.EMAIL_USER,
                        name: 'Hotel Himalayas'
                    },
                    replyTo: mailOptions.replyTo || process.env.EMAIL_REPLY_TO,
                    subject: mailOptions.subject,
                    html: mailOptions.html,
                };
                
                try {
                    const result = await sgMail.send(msg);
                    console.log('✅ Email sent via SendGrid');
                    return { 
                        messageId: result[0].headers['x-message-id'],
                        accepted: [mailOptions.to]
                    };
                } catch (error) {
                    console.error('❌ SendGrid error:', error.response?.body || error.message);
                    throw error;
                }
            },
            verify: (callback) => {
                // SendGrid doesn't need verification, always return success
                console.log('✅ SendGrid API key configured');
                callback(null, true);
            }
        };
    } 
    
    // Use Gmail in production as fallback (if no SendGrid key)
    if (process.env.NODE_ENV === 'production') {
        console.log('📧 Using Gmail SMTP for email service');
        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
        });
    }
    
    // Development environment - use Ethereal
    console.log('📧 Using Ethereal for email service (development)');
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    });
}

const transporter = createTransporter();

// Verify transporter on startup
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Email transporter error:', error.message);
    } else {
        console.log('✅ Email service is ready');
    }
});

module.exports = transporter;