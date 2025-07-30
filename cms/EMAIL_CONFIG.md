# Email Configuration Guide

This guide shows you how to configure real email credentials for your contact form while maintaining the ability to test locally.

## 🚀 Quick Setup

### 1. Create Environment File

Create a `.env` file in the `cms` directory with your email configuration:

```bash
# Copy the example file
cp .env.example .env
```

### 2. Choose Your Email Provider

The system supports multiple email providers. Choose one and configure it:

## 📧 Email Providers

### **SendGrid (Recommended)**

1. **Sign up** at [SendGrid](https://sendgrid.com/) (free tier: 100 emails/day)
2. **Create an API key** in your SendGrid dashboard
3. **Configure your environment**:

```env
NODE_ENV=production
EMAIL_PROVIDER=sendgrid
FROM_EMAIL=hello@thecodemuse.com
ADMIN_EMAIL=admin@thecodemuse.com
SENDGRID_API_KEY=SG.your-api-key-here
```

### **Gmail**

1. **Enable 2-factor authentication** on your Gmail account
2. **Generate an App Password** (Google Account → Security → App Passwords)
3. **Configure your environment**:

```env
NODE_ENV=production
EMAIL_PROVIDER=gmail
FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=admin@thecodemuse.com
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

### **Mailgun**

1. **Sign up** at [Mailgun](https://mailgun.com/) (free tier: 5,000 emails/month)
2. **Get your SMTP credentials** from the Mailgun dashboard
3. **Configure your environment**:

```env
NODE_ENV=production
EMAIL_PROVIDER=mailgun
FROM_EMAIL=hello@thecodemuse.com
ADMIN_EMAIL=admin@thecodemuse.com
MAILGUN_USER=your-mailgun-user
MAILGUN_PASSWORD=your-mailgun-password
```

## 🧪 Testing Locally

### Development Mode (Default)

When `NODE_ENV=development`, the system uses **Ethereal Email** (fake SMTP) for testing:

- ✅ **No real emails sent** - Perfect for development
- ✅ **Preview URLs** - See your emails in a web browser
- ✅ **No credentials needed** - Works out of the box

### Testing with Real Email

To test with real email while developing:

```env
NODE_ENV=production
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-api-key
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `EMAIL_PROVIDER` | Email service provider | `sendgrid` |
| `FROM_EMAIL` | Sender email address | `hello@thecodemuse.com` |
| `ADMIN_EMAIL` | Admin notification email | `admin@thecodemuse.com` |
| `SENDGRID_API_KEY` | SendGrid API key | - |
| `GMAIL_USER` | Gmail username | - |
| `GMAIL_APP_PASSWORD` | Gmail app password | - |
| `MAILGUN_USER` | Mailgun username | - |
| `MAILGUN_PASSWORD` | Mailgun password | - |

## 📋 Setup Steps

### Step 1: Choose Provider
Pick your preferred email provider from the options above.

### Step 2: Get Credentials
Follow the provider-specific setup instructions to get your API keys or SMTP credentials.

### Step 3: Configure Environment
Create a `.env` file in the `cms` directory with your configuration.

### Step 4: Test
1. Start the Strapi server: `npm run develop`
2. Submit a contact form at `http://localhost:3000/contact`
3. Check the console for email preview URLs (development) or real emails (production)

## 🎯 Recommended Setup

For most users, we recommend **SendGrid** because:
- ✅ **Free tier**: 100 emails/day
- ✅ **Easy setup**: Just need an API key
- ✅ **Reliable delivery**: Professional email service
- ✅ **Good documentation**: Easy to troubleshoot

## 🔍 Troubleshooting

### Common Issues

1. **"Authentication failed"** - Check your API key/password
2. **"Connection timeout"** - Verify your SMTP settings
3. **"Rate limit exceeded"** - Upgrade your email provider plan

### Debug Mode

To see detailed email logs, check the Strapi console output when submitting contact forms.

## 🚀 Production Deployment

When deploying to production:

1. **Set environment variables** on your hosting platform
2. **Use production email provider** (not development)
3. **Test thoroughly** before going live
4. **Monitor email delivery** and bounce rates

## 📞 Support

If you need help with email configuration:
1. Check the provider's documentation
2. Verify your credentials are correct
3. Test with a simple email first
4. Check the Strapi console for error messages 