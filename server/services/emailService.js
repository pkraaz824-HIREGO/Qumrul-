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
