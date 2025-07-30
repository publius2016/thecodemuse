import type { Schema, Struct } from '@strapi/strapi';

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
      'shared.social-links': SharedSocialLinks;
    }
  }
}
