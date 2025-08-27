const nodemailer = require('nodemailer');

// Email configuration
const emailConfig = {
  // Development settings (for local testing)
  development: {
    provider: 'ethereal', // Fake SMTP for testing
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'test@ethereal.email',
      pass: 'test@ethereal.email',
    },
  },
  
  // Mailgun settings (alternative)
  mailgun: {
    provider: 'mailgun',
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILGUN_USER || 'postmaster@your-domain.mailgun.org',
      pass: process.env.MAILGUN_PASSWORD || 'your-mailgun-password',
    },
  },
};

// Get the current environment
const getEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

// Create a transporter based on environment
const createTransporter = (emailType = 'default') => {
  const env = getEnvironment();
  
  // For development, use ethereal email (fake SMTP) by default
  if (env === 'development') {
    // Check if we want to use real email service even in development
    const useRealEmail = process.env.USE_REAL_EMAIL_IN_DEV === 'true';
    
    if (useRealEmail) {
      const provider = process.env.EMAIL_PROVIDER || 'mailgun';
      console.log(`Development mode using real email provider: ${provider}`);
      
      switch (provider) {
        case 'mailgun':
          return nodemailer.createTransport(emailConfig.mailgun);
        default:
          return nodemailer.createTransport(emailConfig.development);
      }
    } else {
      console.log('Development mode using Ethereal email (fake SMTP)');
      return nodemailer.createTransport(emailConfig.development);
    }
  }
  
  // For production, use the configured provider
  const provider = process.env.EMAIL_PROVIDER || 'mailgun';
  console.log(`Production mode using email provider: ${provider}`);
  
  switch (provider) {
    case 'mailgun':
      return nodemailer.createTransport(emailConfig.mailgun);

    default:
      return nodemailer.createTransport(emailConfig.development);
  }
};

// Email service
const emailService = {
  async sendWelcomeEmail(contactData: any) {
    const { name, email, subject, message } = contactData;
    try {
      console.log('Sending welcome email...');
      console.log('Welcome email data:', { name, email, subject, message });
      
      const transporter = createTransporter('welcome');
      console.log('Transporter created successfully');
      
      const fromEmail = process.env.FROM_EMAIL || 'hello@thecodemuse.com';
      console.log('From email:', fromEmail);
      
      const emailTemplate = {
        from: `"The Code Muse" <${fromEmail}>`,
        to: email,
        subject: 'Thank you for contacting The Code Muse!',
        headers: {
          'List-Unsubscribe': `<mailto:unsubscribe@thecodemuse.com?subject=unsubscribe>`,
          'X-Mailer': 'The Code Muse Contact Form',
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal'
        },
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank you for contacting us</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background: #f8fafc;
                padding: 30px;
                border-radius: 0 0 8px 8px;
              }
              .button {
                display: inline-block;
                background: #0ea5e9;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                font-size: 14px;
                color: #64748b;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Thank you for reaching out!</h1>
              <p>We've received your message and will get back to you soon.</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name},</h2>
              
              <p>Thank you for contacting <strong>The Code Muse</strong>. We've received your message and appreciate you taking the time to reach out to us.</p>
              
              <h3>Your Message Details:</h3>
              <ul>
                <li><strong>Subject:</strong> ${subject}</li>
                <li><strong>Message:</strong> ${message}</li>
              </ul>
              
              <p>We typically respond to inquiries within 24 hours during business days. In the meantime, feel free to explore our latest articles and tutorials.</p>
              
              <a href="http://localhost:3000/blog" class="button">Explore Our Blog</a>
              
              <p>If you have any urgent questions, you can also reach us directly at <a href="mailto:hello@thecodemuse.com">hello@thecodemuse.com</a>.</p>
              
              <div class="footer">
                <p>Best regards,<br>
                The Code Muse Team</p>
                
                <p><small>
                  This is an automated response to your contact form submission. 
                  Please do not reply to this email directly.
                </small></p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          Thank you for contacting The Code Muse!
          
          Hello ${name},
          
          Thank you for contacting The Code Muse. We've received your message and appreciate you taking the time to reach out to us.
          
          Your Message Details:
          - Subject: ${subject}
          - Message: ${message}
          
          We typically respond to inquiries within 24 hours during business days. In the meantime, feel free to explore our latest articles and tutorials at http://localhost:3000/blog
          
          If you have any urgent questions, you can also reach us directly at hello@thecodemuse.com.
          
          Best regards,
          The Code Muse Team
          
          This is an automated response to your contact form submission. Please do not reply to this email directly.
        `,
      };

      console.log('Attempting to send welcome email...');
      const info = await transporter.sendMail(emailTemplate);
      console.log('Welcome email sent successfully:', info.messageId);
      
      // For development, show the preview URL
      if (getEnvironment() === 'development') {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          console.log('📧 Email Preview URL:', previewUrl);
        }
      }
      
      return { success: true, messageId: info.messageId };
      
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response
      });
      return { success: false, error: error.message };
    }
  },

  async sendAdminNotification(submissionData: any) {
    const { name, email, subject, message, documentId, createdAt, ipAddress, userAgent } = submissionData;
    
    try {
      console.log('Sending admin notification...');
      console.log('Admin notification data:', { name, email, subject, message, documentId });
      
      const transporter = createTransporter('admin');
      console.log('Admin transporter created successfully');
      
      const emailTemplate = {
        from: `"The Code Muse Contact Form" <${process.env.FROM_EMAIL || 'hello@thecodemuse.com'}>`,
        to: process.env.ADMIN_EMAIL || 'manuelsalcido2012@gmail.com',
        subject: `New Contact Form Submission: ${subject}`,
        headers: {
          'X-Mailer': 'The Code Muse Contact Form',
          'X-Priority': '1',
          'X-MSMail-Priority': 'High'
        },
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: #dc2626;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background: #f8fafc;
                padding: 20px;
                border-radius: 0 0 8px 8px;
              }
              .field {
                margin-bottom: 15px;
              }
              .field-label {
                font-weight: bold;
                color: #374151;
              }
              .field-value {
                background: white;
                padding: 10px;
                border-radius: 4px;
                border-left: 4px solid #0ea5e9;
              }
              .metadata {
                background: #f1f5f9;
                padding: 15px;
                border-radius: 4px;
                margin-top: 20px;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>New Contact Form Submission</h1>
              <p>A new message has been submitted through the contact form.</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="field-label">From:</div>
                <div class="field-value">${name} (${email})</div>
              </div>
              
              <div class="field">
                <div class="field-label">Subject:</div>
                <div class="field-value">${subject}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Message:</div>
                <div class="field-value">${message}</div>
              </div>
              
              <div class="metadata">
                <strong>Submission Details:</strong><br>
                <strong>Date:</strong> ${new Date(createdAt).toLocaleString()}<br>
                <strong>IP Address:</strong> ${ipAddress || 'Not available'}<br>
                <strong>User Agent:</strong> ${userAgent || 'Not available'}<br>
                <strong>Submission ID:</strong> ${documentId}
              </div>
              
              <p style="margin-top: 20px;">
                <a href="http://localhost:1337/admin/content-manager/collection-types/api::contact-submission.contact-submission/${documentId}" 
                   style="background: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
                  View in Admin Panel
                </a>
              </p>
            </div>
          </body>
          </html>
        `,
        text: `
          New Contact Form Submission
          
          From: ${name} (${email})
          Subject: ${subject}
          Message: ${message}
          
          Submission Details:
          Date: ${new Date(createdAt).toLocaleString()}
          IP Address: ${ipAddress || 'Not available'}
          User Agent: ${userAgent || 'Not available'}
          Submission ID: ${documentId}
          
          View in Admin Panel: http://localhost:1337/admin/content-manager/collection-types/api::contact-submission.contact-submission/${documentId}
        `,
      };

      const info = await transporter.sendMail(emailTemplate);
      console.log('Admin notification sent successfully:', info.messageId);
      
      // For development, show the preview URL
      if (getEnvironment() === 'development') {
        console.log('📧 Admin Email Preview URL:', nodemailer.getTestMessageUrl(info));
      }
      
      return { success: true, messageId: info.messageId };
      
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      return { success: false, error: error.message };
    }
  },

  // Newsletter email methods
  async sendNewsletterVerificationEmail(signupData: any) {
    const { email, firstName, lastName, verificationToken, source } = signupData;
    
    try {
      console.log('Sending newsletter verification email...');
      console.log('Verification email data:', { email, firstName, verificationToken, source });
      
      const transporter = createTransporter('verification');
      console.log('Transporter created successfully');
      
      const fromEmail = process.env.FROM_EMAIL || 'newsletter@thecodemuse.com';
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;
      
      console.log('From email:', fromEmail);
      console.log('Verification URL:', verificationUrl);
      
      const displayName = firstName ? `${firstName} ${lastName || ''}`.trim() : 'there';
      
      const emailTemplate = {
        from: `"The Code Muse Newsletter" <${fromEmail}>`,
        to: email,
        subject: 'Verify Your Newsletter Subscription - The Code Muse',
        headers: {
          'List-Unsubscribe': `<mailto:unsubscribe@thecodemuse.com?subject=unsubscribe>`,
          'X-Mailer': 'The Code Muse Newsletter',
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal'
        },
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Newsletter Subscription</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
              .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to The Code Muse Newsletter!</h1>
                <p>One more step to complete your subscription</p>
              </div>
              
              <div class="content">
                <h2>Hi ${displayName},</h2>
                
                <p>Thank you for subscribing to The Code Muse newsletter! We're excited to share programming insights, tutorials, and tech tips with you.</p>
                
                <p><strong>To complete your subscription, please verify your email address:</strong></p>
                
                <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
                
                <div class="warning">
                  <strong>⚠️ Important:</strong> This verification link will expire in 24 hours. If you don't verify your email within this time, you'll need to sign up again.
                </div>
                
                <p>If you didn't sign up for our newsletter, you can safely ignore this email.</p>
                
                <p>Best regards,<br>
                The Code Muse Team</p>
              </div>
              
              <div class="footer">
                <p>This email was sent to ${email} because you signed up for The Code Muse newsletter.</p>
                <p>© ${new Date().getFullYear()} The Code Muse. All rights reserved.</p>
                <p>
                  <a href="${frontendUrl}/privacy" style="color: #667eea;">Privacy Policy</a> | 
                  <a href="${frontendUrl}/terms" style="color: #667eea;">Terms of Service</a> | 
                  <a href="mailto:unsubscribe@thecodemuse.com?subject=unsubscribe" style="color: #667eea;">Unsubscribe</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Welcome to The Code Muse Newsletter!

Hi ${displayName},

Thank you for subscribing to The Code Muse newsletter! We're excited to share programming insights, tutorials, and tech tips with you.

To complete your subscription, please verify your email address by clicking this link:

${verificationUrl}

Or copy and paste the link into your browser.

IMPORTANT: This verification link will expire in 24 hours. If you don't verify your email within this time, you'll need to sign up again.

If you didn't sign up for our newsletter, you can safely ignore this email.

Best regards,
The Code Muse Team

---
This email was sent to ${email} because you signed up for The Code Muse newsletter.
© ${new Date().getFullYear()} The Code Muse. All rights reserved.
Privacy Policy: ${frontendUrl}/privacy
Terms of Service: ${frontendUrl}/terms
Unsubscribe: mailto:unsubscribe@thecodemuse.com?subject=unsubscribe
        `
      };
      
      console.log('Sending email...');
      const info = await transporter.sendMail(emailTemplate);
      console.log('Verification email sent successfully:', info.messageId);
      
      // For development, show the preview URL
      if (getEnvironment() === 'development') {
        console.log('📧 Newsletter Verification Email Preview URL:', nodemailer.getTestMessageUrl(info));
      }
      
      return {
        success: true,
        messageId: info.messageId,
        verificationUrl
      };
      
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  },

  async sendNewsletterWelcomeEmail(signupData: any) {
    const { email, firstName, lastName } = signupData;
    
    try {
      console.log('Sending newsletter welcome email...');
      
      const transporter = createTransporter('welcome');
      const fromEmail = process.env.FROM_EMAIL || 'newsletter@thecodemuse.com';
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      const displayName = firstName ? `${firstName} ${lastName || ''}`.trim() : 'there';
      
      const emailTemplate = {
        from: `"The Code Muse Newsletter" <${fromEmail}>`,
        to: email,
        subject: 'Welcome to The Code Muse Newsletter! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to The Code Muse Newsletter</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 10px; margin-top: 20px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to The Code Muse Newsletter!</h1>
                <p>Your subscription is now active</p>
              </div>
              
              <div class="content">
                <h2>Hi ${displayName},</h2>
                
                <p>Great news! Your email has been verified and you're now subscribed to The Code Muse newsletter.</p>
                
                <p>You'll receive our latest programming insights, tutorials, and tech tips delivered straight to your inbox.</p>
                
                <div style="text-align: center;">
                  <a href="${frontendUrl}/blog" class="button">Explore Our Blog</a>
                </div>
                
                <p>We're excited to have you as part of our community!</p>
                
                <p>Best regards,<br>
                The Code Muse Team</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      const info = await transporter.sendMail(emailTemplate);
      console.log('Welcome email sent successfully:', info.messageId);
      
      // For development, show the preview URL
      if (getEnvironment() === 'development') {
        console.log('📧 Newsletter Welcome Email Preview URL:', nodemailer.getTestMessageUrl(info));
      }
      
      return {
        success: true,
        messageId: info.messageId
      };
      
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }
  }
};

export default emailService; 