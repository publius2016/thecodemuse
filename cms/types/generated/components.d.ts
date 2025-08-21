import type { Schema, Struct } from '@strapi/strapi';

export interface SharedConsentTracking extends Struct.ComponentSchema {
  collectionName: 'components_shared_consent_trackings';
  info: {
    description: 'GDPR and compliance consent tracking for newsletter subscribers';
    displayName: 'Consent Tracking';
  };
  attributes: {
    analyticsConsent: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    californiaPrivacyConsent: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    canadaAntiSpamConsent: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    consentDate: Schema.Attribute.DateTime & Schema.Attribute.Required;
    consentHistory: Schema.Attribute.JSON;
    consentSource: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    consentVersion: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    dataRetentionConsent: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    doubleOptIn: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    gdprConsent: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ipAddress: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 45;
      }>;
    lastConsentUpdate: Schema.Attribute.DateTime;
    marketingConsent: Schema.Attribute.Boolean & Schema.Attribute.Required;
    optInMethod: Schema.Attribute.Enumeration<
      ['checkbox', 'button', 'form_submission', 'api', 'import', 'manual']
    > &
      Schema.Attribute.Required;
    privacyPolicyUrl: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    termsOfServiceUrl: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    thirdPartySharingConsent: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    userAgent: Schema.Attribute.Text;
    withdrawalDate: Schema.Attribute.DateTime;
    withdrawalMethod: Schema.Attribute.Enumeration<
      ['unsubscribe_link', 'email_request', 'admin_panel', 'api', 'automatic']
    >;
    withdrawalReason: Schema.Attribute.Text;
  };
}

export interface SharedLocation extends Struct.ComponentSchema {
  collectionName: 'components_shared_locations';
  info: {
    description: 'Geographic location data for newsletter subscribers';
    displayName: 'Location';
  };
  attributes: {
    city: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    country: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
    region: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    timezone: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
  };
}

export interface SharedNewsletterPreferences extends Struct.ComponentSchema {
  collectionName: 'components_shared_newsletter_preferences';
  info: {
    description: 'User preferences and interests for newsletter content';
    displayName: 'Newsletter Preferences';
  };
  attributes: {
    categories: Schema.Attribute.JSON;
    dayOfWeek: Schema.Attribute.Enumeration<
      [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
        'anyday',
      ]
    > &
      Schema.Attribute.DefaultTo<'monday'>;
    excludeTopics: Schema.Attribute.JSON;
    format: Schema.Attribute.Enumeration<['html', 'text', 'both']> &
      Schema.Attribute.DefaultTo<'html'>;
    frequency: Schema.Attribute.Enumeration<
      ['weekly', 'biweekly', 'monthly', 'quarterly']
    > &
      Schema.Attribute.DefaultTo<'weekly'>;
    includeBlogPosts: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    includeProductUpdates: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    includePromotions: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    language: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }> &
      Schema.Attribute.DefaultTo<'en'>;
    maxEmailsPerWeek: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 7;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    timeOfDay: Schema.Attribute.Enumeration<
      ['morning', 'afternoon', 'evening', 'anytime']
    > &
      Schema.Attribute.DefaultTo<'morning'>;
    topics: Schema.Attribute.JSON;
  };
}

export interface SharedSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Social media links for authors';
    displayName: 'Social Links';
  };
  attributes: {
    github: Schema.Attribute.String;
    instagram: Schema.Attribute.String;
    linkedin: Schema.Attribute.String;
    twitter: Schema.Attribute.String;
    website: Schema.Attribute.String;
    youtube: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.consent-tracking': SharedConsentTracking;
      'shared.location': SharedLocation;
      'shared.newsletter-preferences': SharedNewsletterPreferences;
      'shared.social-links': SharedSocialLinks;
    }
  }
}
