export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Add default populate to query
    if (!ctx.query.populate) {
      ctx.query.populate = {
        avatar: true,
        socialLinks: true,
        posts: {
          populate: ['featuredImage', 'categories', 'tags']
        }
      };
    }

    await next();
  };
}; 