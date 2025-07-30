# Email Setup for The Code Muse

This document explains how the email functionality is configured for the contact form.

## Overview

The contact form now sends two types of emails:

1. **Welcome Email** - Sent to the user who submitted the contact form
2. **Admin Notification** - Sent to the admin when a new contact submission is received

## Configuration

### Environment Variables

Add these variables to your `.env` file:

```env
# Email Configuration
EMAIL_FROM=hello@thecodemuse.com
EMAIL_REPLY_TO=hello@thecodemuse.com
ADMIN_EMAIL=admin@thecodemuse.com

# Email Provider (choose one)
EMAIL_PROVIDER=sendmail  # For local development
# EMAIL_PROVIDER=smtp    # For production with SMTP

# SMTP Configuration (if using SMTP)
EMAIL_SMTP_HOST=smtp.example.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=your-username
EMAIL_SMTP_PASS=your-password
EMAIL_SMTP_SECURE=false
```

### Email Providers

#### 1. Sendmail (Development)
Uses the local sendmail service. Good for development and testing.

```env
EMAIL_PROVIDER=sendmail
```

#### 2. SMTP (Production)
Use a real email service like SendGrid, Mailgun, or Gmail.

```env
EMAIL_PROVIDER=smtp
EMAIL_SMTP_HOST=smtp.sendgrid.net
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=apikey
EMAIL_SMTP_PASS=your-sendgrid-api-key
EMAIL_SMTP_SECURE=false
```

#### 3. Mailtrap (Testing)
For testing emails without sending them to real addresses.

```env
EMAIL_PROVIDER=smtp
EMAIL_SMTP_HOST=smtp.mailtrap.io
EMAIL_SMTP_PORT=2525
EMAIL_SMTP_USER=your-mailtrap-user
EMAIL_SMTP_PASS=your-mailtrap-password
EMAIL_SMTP_SECURE=false
```

## Email Templates

### Welcome Email
- **Recipient**: The person who submitted the contact form
- **Content**: Thank you message with their submission details
- **Template**: Located in `src/api/contact-submission/services/contact-submission.ts`

### Admin Notification
- **Recipient**: Admin email address
- **Content**: New contact submission details with metadata
- **Template**: Located in `src/api/contact-submission/content-types/contact-submission/lifecycles.ts`

## Testing

### Test Email Script
Run the test script to verify email functionality:

```bash
node scripts/test-email.js
```

### Manual Testing
1. Submit a contact form through the frontend
2. Check that the welcome email is sent to the user
3. Check that the admin notification is sent to the admin email

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check email provider configuration
   - Verify environment variables are set correctly
   - Check server logs for error messages

2. **Sendmail not working**
   - Install sendmail: `brew install sendmail` (macOS)
   - Or switch to SMTP provider

3. **SMTP authentication errors**
   - Verify username and password
   - Check if 2FA is enabled (use app passwords)
   - Ensure correct port and security settings

### Logs
Check the Strapi server logs for email-related errors:

```bash
npm run develop
```

## Production Setup

For production, we recommend:

1. **Use a reliable email service** like SendGrid, Mailgun, or AWS SES
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Monitor email delivery** and bounce rates
4. **Use environment-specific configurations**

### Example Production Configuration

```env
EMAIL_PROVIDER=smtp
EMAIL_SMTP_HOST=smtp.sendgrid.net
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=apikey
EMAIL_SMTP_PASS=SG.your-sendgrid-api-key
EMAIL_SMTP_SECURE=false
EMAIL_FROM=noreply@thecodemuse.com
EMAIL_REPLY_TO=support@thecodemuse.com
ADMIN_EMAIL=admin@thecodemuse.com
```

## Security Considerations

1. **Never commit email credentials** to version control
2. **Use environment variables** for all sensitive configuration
3. **Implement rate limiting** to prevent spam
4. **Validate email addresses** before sending
5. **Monitor for abuse** and implement CAPTCHA if needed 