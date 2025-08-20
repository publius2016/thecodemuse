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
};

export default emailService; 