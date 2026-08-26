// 1. Require the module
const rssModule = require("@11ty/eleventy-plugin-rss");

// 2. BULLETPROOF UNWRAP: 
const pluginRss = typeof rssModule === 'function' ? rssModule : rssModule.default;

console.log("✅ SUCCESS: eleventy.config.cjs IS LOADING!");

module.exports = function(eleventyConfig) {
  
  // 3. Add the RSS plugin
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPassthroughCopy("css.css");
  eleventyConfig.addPassthroughCopy("assets");

  // --- Helper to guarantee categories is always an array ---
  const getCategoriesArray = (categories) => {
    if (!categories) return [];
    if (Array.isArray(categories)) return categories;
    return [categories]; 
  };

  // --- 1. Excerpt Shortcode ---
  eleventyConfig.addShortcode("excerpt", (post) => {
    const content = post.templateContent || "";
    const endIndex = content.indexOf('</p>');
    if (endIndex > 0) {
      return content.substring(0, endIndex + 4);
    }
    return content;
  });

  // --- 2. Categories Collection ---
  eleventyConfig.addCollection("categories", function(collectionApi) {
    let categories = new Set();
    let posts = collectionApi.getFilteredByTag('post');
    
    posts.forEach(p => {
      let cats = getCategoriesArray(p.data.categories);
      cats.forEach(c => categories.add(c));
    });
    
    return Array.from(categories);
  });

  // --- 3. Filter by Category ---
  eleventyConfig.addFilter("filterByCategory", function(posts, cat) {
    cat = cat.toLowerCase();
    return posts.filter(p => {
      let cats = getCategoriesArray(p.data.categories).map(s => s.toLowerCase());
      return cats.includes(cat);
    });
  }); // <-- ✅ CLOSED PROPERLY HERE

  // --- 4. niceDate Filter (MOVED OUTSIDE!) ---
  // Added formatting options so it looks like "October 26, 2023" instead of "10/26/2023"
eleventyConfig.addFilter("niceDate", function(dateObj) {
  const formatter = new Intl.DateTimeFormat("fi-FI", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  return formatter.format(dateObj);
});
  
  eleventyConfig.addFilter("niceDate", function(dateObj) {
    return englishDate.format(dateObj);
  });

  eleventyConfig.addPassthroughCopy("blog/images/*");
  
  // --- 5. Directory Config ---
  return {
    pathPrefix: "/blog", 
    dir: {
      input: ".",          
      output: "_site",     
      includes: "_includes" 
    }
  };
};
