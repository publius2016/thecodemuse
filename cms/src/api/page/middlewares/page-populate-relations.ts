export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Add default populate to query
    if (!ctx.query.populate) {
      ctx.query.populate = {
        // Pages don't have many relations, but we can add SEO fields if needed
      };
    }

    await next();
  };
}; 