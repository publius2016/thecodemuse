import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::tag.tag', {
  config: {
    find: {
      middlewares: ['api::tag.tag-populate-relations']
    },
    findOne: {
      middlewares: ['api::tag.tag-populate-relations']
    }
  },
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  except: []
}); 