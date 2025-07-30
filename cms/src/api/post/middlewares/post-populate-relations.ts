export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Add default populate to query
    if (!ctx.query.populate) {
      ctx.query.populate = {
        author: {
          populate: ['avatar', 'socialLinks']
        },
        categories: true,
        tags: true,
        featuredImage: true
      };
    }
    
    await next();
  };
}; 