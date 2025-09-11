import { Logger } from '@strapi/logger';
import fetch from 'node-fetch';
import { getEnvironmentConfig } from '../../config/environment';

interface EmailServiceConfig {
  url: string;
  apiKey: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface NewsletterSignupData {
  email: string;
  firstName?: string;
  lastName?: string;
  verificationToken: string;
  source: string;
  sourceUrl: string;
}

class EmailServiceClient {
  private config: EmailServiceConfig;

  constructor() {
    const envConfig = getEnvironmentConfig();
    
    this.config = {
      url: envConfig.email.serviceUrl,
      apiKey: envConfig.email.apiKey,
      timeout: envConfig.email.timeout,
      retryAttempts: parseInt(process.env.EMAIL_SERVICE_RETRY_ATTEMPTS || '3'),
      retryDelay: parseInt(process.env.EMAIL_SERVICE_RETRY_DELAY || '1000')
    };
  }

  private async makeRequest(endpoint: string, data: any): Promise<EmailResponse> {
    const url = `${this.config.url}${endpoint}`;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        console.log(`Email service request attempt ${attempt}/${this.config.retryAttempts}`, {
          endpoint,
          url,
          attempt
        });

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.config.apiKey
          },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(this.config.timeout)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json() as EmailResponse;
        
        console.log('Email service request successful', {
          endpoint,
          attempt,
          success: result.success
        });

        return result;

      } catch (error) {
        console.error(`Email service request attempt ${attempt} failed`, {
          endpoint,
          attempt,
          error: error.message,
          url
        });

        if (attempt === this.config.retryAttempts) {
          throw error;
        }

        // Exponential backoff
        const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('All retry attempts failed');
  }


  async sendWelcomeEmail(contactData: ContactFormData): Promise<EmailResponse> {
    return await this.makeRequest('/api/v1/contact/welcome', contactData);
  }

  async sendNewsletterVerificationEmail(signupData: NewsletterSignupData): Promise<EmailResponse> {
    console.log('Sending newsletter verification email from CMS', signupData);
    return await this.makeRequest('/api/v1/newsletter/verification', signupData);
  }

  async sendNewsletterWelcomeEmail(signupData: NewsletterSignupData): Promise<EmailResponse> {
    return await this.makeRequest('/api/v1/newsletter/welcome', signupData);
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.url}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch (error) {
      console.error('Email service health check failed', { error: error.message });
      return false;
    }
  }
}

export const emailServiceClient = new EmailServiceClient();
export default emailServiceClient;
