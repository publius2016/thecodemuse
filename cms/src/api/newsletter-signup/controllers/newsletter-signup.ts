import { factories } from '@strapi/strapi';
import crypto from 'crypto';

// Helper function to generate verification token
function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

export default factories.createCoreController('api::newsletter-signup.newsletter-signup', ({ strapi }) => ({
  // Create a new newsletter signup
  async create(ctx) {
    try {
      const { body } = ctx.request;
      
      // Validate required fields
      if (!body.email) {
        return ctx.badRequest('Email is required');
      }

      // Check if email already exists
      const existingSignup = await strapi.entityService.findMany('api::newsletter-signup.newsletter-signup', {
        filters: { email: body.email }
      });

      if (existingSignup.length > 0) {
        return ctx.badRequest('Email already subscribed to newsletter');
      }

      // Prepare signup data
      const signupData = {
        ...body,
        status: 'pending',
        subscriptionDate: new Date(),
        verified: false,
        verificationToken: generateVerificationToken(),
        verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        source: body.source || 'api',
        sourceUrl: body.sourceUrl || ctx.request.url,
        ipAddress: ctx.request.ip,
        userAgent: ctx.request.headers['user-agent'],
        consent: {
          marketingConsent: true,
          consentDate: new Date(),
          consentVersion: '1.0',
          consentSource: ctx.request.url,
          ipAddress: ctx.request.ip,
          userAgent: ctx.request.headers['user-agent'],
          optInMethod: 'form_submission'
        },
        preferences: body.preferences || {
          frequency: 'weekly',
          format: 'html',
          language: 'en',
          includeBlogPosts: true
        },
        location: body.location || {}
      };

      // Create the signup
      const signup = await strapi.entityService.create('api::newsletter-signup.newsletter-signup', {
        data: signupData
      });

      // Send verification email if double opt-in is enabled
      if (signupData.consent.doubleOptIn) {
        // TODO: Send verification email
        strapi.log.info('Verification email should be sent to:', signupData.email);
      }

      // Return success response
      ctx.send({
        message: 'Newsletter signup successful! Please check your email to verify your subscription.',
        data: {
          id: signup.id,
          email: signup.email,
          status: signup.status,
          verified: signup.verified
        }
      });

    } catch (error) {
      strapi.log.error('Newsletter signup error:', error);
      ctx.internalServerError('Failed to create newsletter signup');
    }
  },

  // Get all newsletter signups (admin only)
  async find(ctx) {
    try {
      const { page = 1, pageSize = 25, status, source, search } = ctx.query;

      const filters: any = {};
      
      if (status) filters.status = status;
      if (source) filters.source = source;
      if (search) {
        filters.$or = [
          { email: { $containsi: search } },
          { firstName: { $containsi: search } },
          { lastName: { $containsi: search } }
        ];
      }

      const signups = await strapi.entityService.findMany('api::newsletter-signup.newsletter-signup', {
        filters,
        pagination: {
          page: parseInt(page as string),
          pageSize: parseInt(pageSize as string)
        },
        sort: { subscriptionDate: 'desc' }
      });

      ctx.send(signups);
    } catch (error) {
      strapi.log.error('Newsletter signup find error:', error);
      ctx.internalServerError('Failed to fetch newsletter signups');
    }
  },

  // Get a single newsletter signup
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      
      const signup = await strapi.entityService.findOne('api::newsletter-signup.newsletter-signup', id);

      if (!signup) {
        return ctx.notFound('Newsletter signup not found');
      }

      ctx.send(signup);
    } catch (error) {
      strapi.log.error('Newsletter signup findOne error:', error);
      ctx.internalServerError('Failed to fetch newsletter signup');
    }
  },

  // Update newsletter signup
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { body } = ctx.request;

      const signup = await strapi.entityService.update('api::newsletter-signup.newsletter-signup', id, {
        data: body
      });

      ctx.send(signup);
    } catch (error) {
      strapi.log.error('Newsletter signup update error:', error);
      ctx.internalServerError('Failed to update newsletter signup');
    }
  },

  // Delete newsletter signup
  async delete(ctx) {
    try {
      const { id } = ctx.params;
      
      await strapi.entityService.delete('api::newsletter-signup.newsletter-signup', id);
      
      ctx.send({ message: 'Newsletter signup deleted successfully' });
    } catch (error) {
      strapi.log.error('Newsletter signup delete error:', error);
      ctx.internalServerError('Failed to delete newsletter signup');
    }
  },

  // Verify email subscription
  async verify(ctx) {
    try {
      const { token } = ctx.params;

      const signup = await strapi.entityService.findMany('api::newsletter-signup.newsletter-signup', {
        filters: { 
          verificationToken: token,
          verified: false,
          verificationExpires: { $gt: new Date() }
        }
      });

      if (signup.length === 0) {
        return ctx.badRequest('Invalid or expired verification token');
      }

      const signupToVerify = signup[0];

      // Update signup status
      const updatedSignup = await strapi.entityService.update('api::newsletter-signup.newsletter-signup', signupToVerify.id, {
        data: {
          status: 'active',
          verified: true,
          verificationToken: null,
          verificationExpires: null
        }
      });

      ctx.send({
        message: 'Email verified successfully! You are now subscribed to our newsletter.',
        data: updatedSignup
      });

    } catch (error) {
      strapi.log.error('Newsletter verification error:', error);
      ctx.internalServerError('Failed to verify newsletter subscription');
    }
  },

  // Unsubscribe from newsletter
  async unsubscribe(ctx) {
    try {
      const { email } = ctx.request.body;

      if (!email) {
        return ctx.badRequest('Email is required');
      }

      const signup = await strapi.entityService.findMany('api::newsletter-signup.newsletter-signup', {
        filters: { email }
      });

      if (signup.length === 0) {
        return ctx.notFound('Email not found in newsletter subscriptions');
      }

      const signupToUpdate = signup[0];

      // Update signup status
      const updatedSignup = await strapi.entityService.update('api::newsletter-signup.newsletter-signup', signupToUpdate.id, {
        data: {
          status: 'unsubscribed'
        }
      });

      ctx.send({
        message: 'Successfully unsubscribed from newsletter',
        data: updatedSignup
      });

    } catch (error) {
      strapi.log.error('Newsletter unsubscribe error:', error);
      ctx.internalServerError('Failed to unsubscribe from newsletter');
    }
  },

  // Get newsletter statistics
  async stats(ctx) {
    try {
      const totalSubscribers = await strapi.entityService.count('api::newsletter-signup.newsletter-signup');
      const activeSubscribers = await strapi.entityService.count('api::newsletter-signup.newsletter-signup', {
        filters: { status: 'active' }
      });
      const pendingSubscribers = await strapi.entityService.count('api::newsletter-signup.newsletter-signup', {
        filters: { status: 'pending' }
      });
      const unsubscribedSubscribers = await strapi.entityService.count('api::newsletter-signup.newsletter-signup', {
        filters: { status: 'unsubscribed' }
      });

      // Get signups by source
      const signupsBySource = await strapi.db.connection
        .from('newsletter_signups')
        .select('source')
        .count('* as count')
        .groupBy('source');

      ctx.send({
        total: totalSubscribers,
        active: activeSubscribers,
        pending: pendingSubscribers,
        unsubscribed: unsubscribedSubscribers,
        bySource: signupsBySource
      });

    } catch (error) {
      strapi.log.error('Newsletter stats error:', error);
      ctx.internalServerError('Failed to fetch newsletter statistics');
    }
  }
}));
