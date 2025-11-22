const transporter = require('../config/emailConfig');

// Email templates
const getBookingConfirmationEmail = (booking, customer, roomDetails) => {
  const checkInDate = new Date(booking.check_in_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const checkOutDate = new Date(booking.check_out_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const nights = Math.ceil(
    (new Date(booking.check_out_date) - new Date(booking.check_in_date)) / (1000 * 60 * 60 * 24)
  );

  // ✅ FIX: Properly create roomsHtml with null check
  const roomsHtml = roomDetails && roomDetails.length > 0
    ? roomDetails
        .map(room => `
          <tr style="border-bottom: 1px solid #e0e0e0;">
            <td style="padding: 12px; text-align: left;">Room ${room.room_no}</td>
            <td style="padding: 12px; text-align: center;">${room.room_catagory_name}</td>
            <td style="padding: 12px; text-align: right;">Rs ${parseFloat(room.price_per_night).toLocaleString('en-NP', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
        `)
        .join('')
    : '<tr><td colspan="3" style="text-align: center; padding: 12px;">No room details available</td></tr>';

  const totalAmount = parseFloat(booking.total_amount).toLocaleString('en-NP', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return {
    subject: `🎉 Booking Confirmation - Hotel Himalayas (Booking #${booking.booking_id})`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f9f9f9;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 30px;
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 20px;
              color: #333;
            }
            .booking-id {
              background-color: #f0f4ff;
              border-left: 4px solid #667eea;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .booking-id strong {
              color: #667eea;
            }
            .section {
              margin: 25px 0;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #333;
              border-bottom: 2px solid #667eea;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 15px 0;
            }
            .info-item {
              background-color: #f9f9f9;
              padding: 12px;
              border-radius: 4px;
            }
            .info-label {
              font-weight: bold;
              color: #667eea;
              font-size: 12px;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .info-value {
              font-size: 16px;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            .total-row {
              font-weight: bold;
              background-color: #f0f4ff;
              font-size: 18px;
            }
            .total-row td {
              padding: 15px 12px;
            }
            .cta-button {
              display: inline-block;
              background-color: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 4px;
              margin-top: 20px;
              font-weight: bold;
            }
            .cta-button:hover {
              background-color: #764ba2;
            }
            .footer {
              background-color: #f9f9f9;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #e0e0e0;
            }
            .footer-link {
              color: #667eea;
              text-decoration: none;
            }
            .alert {
              background-color: #fff3cd;
              border: 1px solid #ffc107;
              color: #856404;
              padding: 12px;
              border-radius: 4px;
              margin: 15px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏨 Hotel Himalayas</h1>
              <p style="margin: 10px 0 0 0;">Booking Confirmation</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Dear ${customer.first_name},
              </div>
              
              <p>Thank you for booking with Hotel Himalayas! Your reservation has been confirmed and we're excited to welcome you.</p>
              
              <div class="booking-id">
                <strong>Booking Reference:</strong> #${booking.booking_id}
              </div>
              
              <div class="section">
                <div class="section-title">📅 Stay Details</div>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Check-in</div>
                    <div class="info-value">${checkInDate}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Check-out</div>
                    <div class="info-value">${checkOutDate}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Total Nights</div>
                    <div class="info-value">${nights}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Number of Rooms</div>
                    <div class="info-value">${roomDetails.length}</div>
                  </div>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">🛏️ Room Details</div>
                <table>
                  <thead style="background-color: #f0f4ff;">
                    <tr>
                      <th style="padding: 12px; text-align: left; color: #667eea;">Room Number</th>
                      <th style="padding: 12px; text-align: center; color: #667eea;">Category</th>
                      <th style="padding: 12px; text-align: right; color: #667eea;">Price/Night</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${roomsHtml}
                  </tbody>
                </table>
              </div>
              
              <div class="section">
                <table style="border: none;">
                  <tr class="total-row">
                    <td style="text-align: left;">Total Amount to Pay:</td>
                    <td style="text-align: right;">Rs ${totalAmount}</td>
                  </tr>
                </table>
              </div>
              
              <div class="alert">
                <strong>⏰ Check-in Time:</strong> 2:00 PM | <strong>Check-out Time:</strong> 11:00 AM
              </div>
              
              <div class="section">
                <div class="section-title">👤 Guest Information</div>
                <div class="info-item">
                  <p><strong>Name:</strong> ${customer.first_name} ${customer.last_name}</p>
                  <p><strong>Email:</strong> ${customer.email}</p>
                  <p><strong>Phone:</strong> ${customer.phone_no}</p>
                </div>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                If you have any questions or need to make changes to your booking, please don't hesitate to contact us.
              </p>
              
              <a href="https://hotelhimalayas.example.com/booking/${booking.booking_id}" class="cta-button">View Your Booking</a>
            </div>
            
            <div class="footer">
              <p>
                <strong>Hotel Himalayas</strong><br>
                Kathmandu, Nepal<br>
                📞 +977 4546789 | 📧 info@hotelhimalayas.com<br>
                <a href="https://hotelhimalayas.example.com" class="footer-link">www.hotelhimalayas.com</a>
              </p>
              <p style="margin-top: 15px; font-size: 11px;">
                This is an automated email. Please do not reply to this email. For assistance, contact our support team.
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  };
};

// Send booking confirmation email
const sendBookingConfirmation = async (booking, customer, roomDetails) => {
  try {
    const emailContent = getBookingConfirmationEmail(booking, customer, roomDetails);
    
    const mailOptions = {
      from: `"Hotel Himalayas" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: emailContent.subject,
      html: emailContent.html,
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_USER
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully');
    console.log('Message ID:', info.messageId);
    
    // For development with Ethereal, log preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

// Generic email sender
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Hotel Himalayas" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_USER
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmation,
  sendEmail,
  getBookingConfirmationEmail
};