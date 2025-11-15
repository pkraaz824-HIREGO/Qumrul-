import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ SMTP connection error:', error.message);
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

// Send password reset email
export async function sendPasswordResetEmail(email, resetLink) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Your Elite Store Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d4af37 0%, #f2d06b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #d4af37; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You requested to reset your password for your Elite Store account.</p>
              <p>Click the button below to reset your password. This link will expire in <strong>1 hour</strong>.</p>
              <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                Or copy and paste this link in your browser:<br>
                <a href="${resetLink}" style="color: #d4af37;">${resetLink}</a>
              </p>
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <strong>Didn't request this?</strong><br>
                If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Elite Store. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
}

// Send invoice email with PDF attachment
export async function sendInvoiceEmail(email, pdfBuffer, orderNumber) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Your LAP Ultra Invoice - Order #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d4af37 0%, #f2d06b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Order!</h1>
            </div>
            <div class="content">
              <p>Dear Customer,</p>
              <p>Thank you for shopping at LAP Ultra!</p>
              <p>Please find your invoice attached to this email for order <strong>#${orderNumber}</strong>.</p>
              <p>Your order is being processed and will be shipped shortly.</p>
              <p style="margin-top: 30px;">
                <strong>Need Help?</strong><br>
                If you have any questions about your order, please contact us at support@elitestore.com
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} LAP Ultra. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `Invoice-${orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Invoice email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending invoice email:', error);
    throw error;
  }
}

// Send OTP email for profile updates
export async function sendOTPEmail(email, otp, purpose) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Your LAP Ultra Verification Code - ${purpose}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d4af37 0%, #f2d06b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #d4af37; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #d4af37; letter-spacing: 5px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Verification Required</h1>
            </div>
            <div class="content">
              <h2>Verification Code for ${purpose}</h2>
              <p>You have requested to update your profile information. Please use the verification code below:</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              <p>This code will expire in <strong>10 minutes</strong>.</p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you did not request this code, please ignore this email and ensure your account is secure.
              </div>
              <p style="margin-top: 30px;">Best regards,<br><strong>LAP Ultra Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} LAP Ultra. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    throw error;
  }
}

// Send welcome email to new users
export async function sendWelcomeEmail(email, firstName) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Welcome to Elite Store - Your Account is Ready! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d4af37 0%, #f2d06b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #d4af37; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .feature-box { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #d4af37; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Elite Store!</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${firstName}</strong>,</p>
              <p>Thank you for creating an account with Elite Store! We're thrilled to have you join our community of savvy shoppers.</p>
              
              <h3 style="color: #d4af37; margin-top: 25px;">🌟 What You Can Do Now:</h3>
              
              <div class="feature-box">
                <strong>🛍️ Browse Premium Products</strong><br>
                Explore our curated collection of laptops, mobile phones, and accessories
              </div>
              
              <div class="feature-box">
                <strong>💰 Exclusive Deals</strong><br>
                Access special discounts and limited-time offers
              </div>
              
              <div class="feature-box">
                <strong>📦 Track Your Orders</strong><br>
                Monitor your purchases from checkout to delivery
              </div>
              
              <div class="feature-box">
                <strong>⚡ Fast Checkout</strong><br>
                Save your addresses and payment methods for quick ordering
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/products" class="button">Start Shopping Now</a>
              </div>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <strong>Need Help?</strong><br>
                Our customer support team is here to assist you. Contact us at ${process.env.SMTP_FROM}
              </p>
              
              <p style="margin-top: 20px;">Happy Shopping!<br><strong>The Elite Store Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Elite Store. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(email, orderDetails) {
  const { orderId, firstName, items, total, shippingAddress, paymentMethod } = orderDetails;
  
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <span style="color: #666; font-size: 14px;">Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Order Confirmation - #${orderId} 📦`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d4af37 0%, #f2d06b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 2px solid #d4af37; }
            .button { display: inline-block; padding: 12px 30px; background: #d4af37; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .total-row { background: #f0f0f0; font-weight: bold; font-size: 16px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Order Confirmed!</h1>
              <p style="font-size: 18px; margin: 10px 0;">Order #${orderId}</p>
            </div>
            <div class="content">
              <p>Dear <strong>${firstName}</strong>,</p>
              <p>Thank you for your order! We're excited to get your products to you.</p>
              
              <div class="order-box">
                <h3 style="color: #d4af37; margin-top: 0;">📦 Order Summary</h3>
                <table>
                  <thead>
                    <tr style="background: #f9f9f9;">
                      <th style="padding: 10px; text-align: left;">Item</th>
                      <th style="padding: 10px; text-align: right;">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                    <tr class="total-row">
                      <td style="padding: 15px;">Total Amount</td>
                      <td style="padding: 15px; text-align: right;">₹${total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #d4af37; margin-top: 0;">🚚 Shipping Address</h3>
                <p style="margin: 5px 0;">${shippingAddress}</p>
              </div>
              
              <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #d4af37; margin-top: 0;">💳 Payment Method</h3>
                <p style="margin: 5px 0;">${paymentMethod}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/my-orders" class="button">Track Your Order</a>
              </div>
              
              <p style="background: #e8f5e9; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50;">
                <strong>📧 What's Next?</strong><br>
                You'll receive tracking information once your order ships. We'll keep you updated every step of the way!
              </p>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <strong>Need Help?</strong><br>
                Contact us at ${process.env.SMTP_FROM} or call +91 77658 88430
              </p>
              
              <p style="margin-top: 20px;">Thank you for choosing Elite Store!<br><strong>The Elite Store Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Elite Store. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    throw error;
  }
}
