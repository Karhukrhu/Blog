const pluginRss = require("@11ty/eleventy-plugin-rss");

console.log("✅ SUCCESS: eleventy.config.cjs IS LOADING!");

module.exports = function(eleventyConfig) {
  
  // 1. Add the RSS plugin
  eleventyConfig.addPlugin(pluginRss);

  // 2. Passthrough copies
  eleventyConfig.addPassthroughCopy("css.css");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("blog/images/*");

  // --- Helper to guarantee categories is always an array ---
  const getCategoriesArray = (categories) => {
    if (!categories) return [];
    if (Array.isArray(categories)) return categories;
    return [categories]; 
  };

  // --- 3. Excerpt Shortcode ---
  eleventyConfig.addShortcode("excerpt", (post) => {
    const content = post.templateContent || "";
    const endIndex = content.indexOf('</p>');
    if (endIndex > 0) {
      return content.substring(0, endIndex + 4);
    }
    return content;
  });

  // --- 4. Categories Collection ---
  eleventyConfig.addCollection("categories", function(collectionApi) {
    let categories = new Set();
    let posts = collectionApi.getFilteredByTag('post');
    
    posts.forEach(p => {
      let cats = getCategoriesArray(p.data.categories);
      cats.forEach(c => categories.add(c));
    });
    
    return Array.from(categories);
  });

  // --- 5. Filter by Category ---
  eleventyConfig.addFilter("filterByCategory", function(posts, cat) {
    cat = cat.toLowerCase();
    return posts.filter(p => {
      let cats = getCategoriesArray(p.data.categories).map(s => s.toLowerCase());
      return cats.includes(cat);
    });
  });

  // --- 6. niceDate Filter ---
  eleventyConfig.addFilter("niceDate", function(dateObj) {
    const formatter = new Intl.DateTimeFormat("fi-FI", {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    return formatter.format(dateObj);
  });

  // --- 7. Tag Cloud Collection ---
  eleventyConfig.addCollection("tagCloud", function(collectionApi) {
    let categories = {};
    let posts = collectionApi.getFilteredByTag('post');

    posts.forEach(post => {
      let cats = post.data.categories || [];
      if (!Array.isArray(cats)) cats = [cats];
      cats.forEach(cat => {
        categories[cat] = (categories[cat] || 0) + 1;
      });
    });

    let counts = Object.values(categories);
    let minCount = Math.min(...counts);
    let maxCount = Math.max(...counts);

    let cloud = Object.keys(categories).map(cat => {
      let count = categories[cat];
      let fontSize = 9; 
      if (maxCount > minCount) {
        fontSize = 8 + ((count - minCount) / (maxCount - minCount)) * 12;
      }

      return {
        name: cat,
        count: count,
        slug