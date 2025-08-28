export default {
  routes: [
    // Public routes
    {
      method: 'POST',
      path: '/newsletter-signups',
      handler: 'newsletter-signup.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
        description: 'Subscribe to newsletter',
        tag: {
          plugin: 'newsletter-signup',
          name: 'Newsletter signup',
          actionType: 'create'
        }
      }
    },
    {
      method: 'POST',
      path: '/newsletter-signups/verify/:token',
      handler: 'newsletter-signup.verify',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
        description: 'Verify email subscription',
        tag: {
          plugin: 'newsletter-signup',
          name: 'Newsletter verification',
          actionType: 'update'
        }
      }
    },
    {
      method: 'POST',
      path: '/newsletter-signups/unsubscribe',
      handler: 'newsletter-signup.unsubscribe',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
        description: 'Unsubscribe from newsletter',
        tag: {
          plugin: 'newsletter-signup',
          name: 'Newsletter unsubscribe',
          actionType: 'update'
        }
      }
    },
    
    // Admin routes (protected)
    {
      method: 'GET',
      path: '/newsletter-signups',
      handler: 'newsletter-signup.find',
      config: {
        auth: {
          scope: ['admin::newsletter-signup.read']
        },
        policies: [],
        middlewares: [],
        description: 'Get all newsletter signups (admin only)',
        tag: {
          plugin: 'newsletter-signup',
          name: 'Newsletter signups list',
          actionType: 'read'
        }
      }
    },
    {
      method: 'GET',
      path: '/newsletter-signups/:id',
      handler: 'newsletter-signup.findOne',
      config: {
        auth: {
          scope: ['admin::newsletter-signup.read']
        },
        policies: [],
        middlewares: [],
        description: 'Get newsletter signup by ID (admin only)',
        tag: {
          plugin: 'newsletter-signup',
          name: 'Newsletter signup details',
          actionType: 'read'
        }
      }
    },
    {
      method: 'PUT',
      path: '/newsletter-signups/:id',
      handler: 'newsletter-signup.update',
      config: {
        auth: {
          scope: ['admin::newsletter-signup.update']
        },
        policies: [],
        middlewares: [],
        description: 'Update newsletter signup (admin only)',
        tag: {
          plugin: 'newsletter-signup',
          name: 'Newsletter signup update',
          actionType: 'update'
        }
      }
    },
    {
      method: 'DELETE',
      path: '/newsletter-signups/:id',
      handler: 'newsletter-signup.delete',
      config: {
        auth: {
          scope: ['admin::newsletter-signup.delete']
        },
        policies: [],
        middlewares: [],
        description: 'Delete newsletter signup (admin only)',
        tag: {
          plugin: 'newsletter-signup',
          name: 'Newsletter signup delete',
          actionType: 'delete'
        }
      }
    },
    {
      method: 'GET',
      path: '/newsletter-signups/stats/overview',
      handler: 'newsletter-signup.stats',
      config: {
        auth: {
          scope: ['admin::newsletter-signup.read']
        },
        policies: [],
        middlewares: [],
        description: 'Get newsletter statistics (admin only)',
        tag: {
          plugin: 'newsletter-signup',
          name: 'Newsletter statistics',
          actionType: 'read'
        }
      }
    }
  ]
};
