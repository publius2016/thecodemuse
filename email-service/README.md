# Standalone Email Service

## 🏗️ **Architecture Overview**

A standalone email service that can handle multiple applications and domains through a single Mailgun account.

## 📁 **Project Structure**

```
email-service/
├── src/
│   ├── config/
│   │   ├── mailgun.ts          # Mailgun configuration
│   │   ├── domains.ts          # Domain-specific settings
│   │   └── templates.ts        # Email templates
│   ├── services/
│   │   ├── email-sender.ts     # Core email sending logic
│   │   ├── template-engine.ts  # Template rendering
│   │   └── domain-manager.ts   # Multi-domain management
│   ├── types/
│   │   └── email.ts            # TypeScript interfaces
│   └── utils/
│       ├── validation.ts       # Email validation
│       └── logging.ts          # Logging utilities
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 **Key Features**

### **Multi-Domain Support**
- Configure multiple domains in one service
- Domain-specific authentication (SPF, DKIM, DMARC)
- Custom sending limits per domain

### **Template System**
- Reusable email templates
- Dynamic content injection
- Multiple template engines (Handlebars, EJS, etc.)

### **API Interface**
- REST API for sending emails
- Webhook support for delivery tracking
- Rate limiting and authentication

## 📧 **Usage Examples**

### **Send Welcome Email**
```typescript
import { EmailService } from './src/services/email-sender';

const emailService = new EmailService();

await emailService.sendWelcomeEmail({
  domain: 'thecodemuse.com',
  to: 'user@example.com',
  data: {
    name: 'John Doe',
    subject: 'Welcome!',
    message: 'Thank you for signing up!'
  }
});
```

### **Send Admin Notification**
```typescript
await emailService.sendAdminNotification({
  domain: 'thecodemuse.com',
  to: 'admin@thecodemuse.com',
  data: {
    name: 'John Doe',
    email: 'user@example.com',
    subject: 'Contact Form',
    message: 'Hello there!'
  }
});
```

## 🌐 **Domain Configuration**

### **Domain Settings**
```typescript
const domains = {
  'thecodemuse.com': {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: 'thecodemuse.com',
    fromEmail: 'hello@thecodemuse.com',
    replyTo: 'support@thecodemuse.com',
    templates: {
      welcome: 'welcome-template',
      admin: 'admin-notification'
    }
  },
  'otherapp.com': {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: 'otherapp.com',
    fromEmail: 'noreply@otherapp.com',
    replyTo: 'help@otherapp.com',
    templates: {
      welcome: 'otherapp-welcome',
      admin: 'otherapp-admin'
    }
  }
};
```

## 🚀 **Deployment Options**

### **1. Standalone Service**
- Deploy as separate microservice
- Use with any application via HTTP API
- Easy to scale independently

### **2. NPM Package**
- Install in multiple projects
- Share email logic across applications
- Version control for email templates

### **3. Docker Container**
- Containerized email service
- Easy deployment to any environment
- Consistent behavior across platforms

## 📊 **Monitoring & Analytics**

### **Per-Domain Metrics**
- Delivery rates
- Bounce rates
- Spam complaints
- Open/click rates

### **Webhook Integration**
- Real-time delivery tracking
- Bounce notifications
- Spam report alerts

## 🔒 **Security Features**

### **Authentication**
- API key management
- Rate limiting per domain
- IP whitelisting

### **Validation**
- Email address validation
- Content filtering
- Attachment scanning

## 💰 **Cost Benefits**

### **Mailgun Account**
- Single account for all domains
- Shared sending limits
- Bulk pricing discounts

### **Infrastructure**
- One service to maintain
- Shared monitoring and logging
- Reduced development time

## 🎯 **Best Use Cases**

### **Perfect For:**
- Multiple applications with different domains
- SaaS platforms with white-label options
- Agencies managing multiple client domains
- Microservices architecture

### **Consider Alternatives If:**
- Single application with one domain
- Very simple email needs
- Tight coupling with CMS required
