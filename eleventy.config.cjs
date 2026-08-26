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
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });
  return formatter.format(dateObj);
});
  

  eleventyConfig.addPassthroughCopy("blog/images/*");

    // --- Tag Cloud Collection ---
  eleventyConfig.addCollection("tagCloud", function(collectionApi) {
    let categories = {};
    let posts = collectionApi.getFilteredByTag('post');

    // 1. Count how many posts are in each category
    posts.forEach(post => {
      let cats = post.data.categories || [];
      if (!Array.isArray(cats)) cats = [cats];
      cats.forEach(cat => {
        categories[cat] = (categories[cat] || 0) + 1;
      });
    });

    // 2. Find the lowest and highest counts to scale the sizes
    let counts = Object.values(categories);
    let minCount = Math.min(...counts);
    let maxCount = Math.max(...counts);

    // 3. Build the cloud and calculate font sizes
    let cloud = Object.keys(categories).map(cat => {
      let count = categories[cat];
      
      // Calculate size between 1rem (smallest) and 2.5rem (largest)
      let fontSize = 1; 
      if (maxCount > minCount) {
        fontSize = 1 + ((count - minCount) / (maxCount - minCount)) * 1.5;
      }

      return {
        name: cat,
        count: count,
        slug: cat.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
        fontSize: fontSize.toFixed(2) + 'rem' // e.g., "1.85rem"
      };
    });

    // 4. Sort alphabetically so it looks like a nice cloud
    cloud.sort((a, b) => a.name.localeCompare(b.name));

    return cloud;
  });
  
  
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
