// 1. Require the module
const rssModule = require("@11ty/eleventy-plugin-rss");

// 2. BULLETPROOF UNWRAP (Required for Node 20 / Eleventy 3 compatibility)
const pluginRss = typeof rssModule === 'function' ? rssModule : rssModule.default;

module.exports = function(eleventyConfig) {

  eleventyConfig.addFilter("makeUrlsAbsolute", function(content) {
    if (!content) return content;
    
    let result = content;

    // 1. Fix URLs
    result = result.replace(/src="\//g, 'src="https://karhukarhu.place/blog/');
    result = result.replace(/href="\//g, 'href="https://karhukarhu.place/blog/');

    // 2. Force Centering (Bulletproof regex)
    // Matches class="img-center" even if there are extra spaces or single quotes
    result = result.replace(/class=["']img-center\s*["']/gi, 'style="text-align: center; margin: 15px auto; width: 100%;"');

    // 3. Force Image Centering
    // Matches <img followed by any whitespace (space, tab, or newline)
    result = result.replace(/<img\s/gi, '<img style="display: inline-block; margin: 0 auto; max-width: 100%; height: auto;" ');

    return result;
  });

  // 3. Add the RSS plugin
  eleventyConfig.addPlugin(pluginRss);

  // 4. Passthrough copies
  eleventyConfig.addPassthroughCopy("css.css");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("blog/images/*");
  eleventyConfig.addPassthroughCopy({ "rss.css": "blog/rss.css" });
  
  // 🐻 COPY IMAGES FROM YOUR POSTS FOLDER:
  eleventyConfig.addPassthroughCopy("posts/**/*.png");
  eleventyConfig.addPassthroughCopy("posts/**/*.jpg");
  eleventyConfig.addPassthroughCopy("posts/**/*.jpeg");
  eleventyConfig.addPassthroughCopy("posts/**/*.webp");
  eleventyConfig.addPassthroughCopy("posts/**/*.gif");

  // --- Helper to guarantee categories is always an array ---
  const getCategoriesArray = (categories) => {
    if (!categories) return [];
    if (Array.isArray(categories)) return categories;
    return [categories]; 
  };

  // --- 5. Excerpt Shortcode ---
  eleventyConfig.addShortcode("excerpt", (post) => {
    const content = post.templateContent || "";
    const endIndex = content.indexOf('</p>');
    if (endIndex > 0) {
      return content.substring(0, endIndex + 4);
    }
    return content;
  });

  // --- 6. Categories Collection ---
  eleventyConfig.addCollection("categories", function(collectionApi) {
    let categories = new Set();
    let posts = collectionApi.getFilteredByTag('post');
    
    posts.forEach(p => {
      let cats = getCategoriesArray(p.data.categories);
      cats.forEach(c => categories.add(c));
    });
    
    return Array.from(categories);
  });

  // --- 7. Filter by Category ---
  eleventyConfig.addFilter("filterByCategory", function(posts, cat) {
    cat = cat.toLowerCase();
    return posts.filter(p => {
      let cats = getCategoriesArray(p.data.categories).map(s => s.toLowerCase());
      return cats.includes(cat);
    });
  });

  // --- 8. niceDate Filter ---
  eleventyConfig.addFilter("niceDate", function(dateObj) {
    const formatter = new Intl.DateTimeFormat("fi-FI", {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    return formatter.format(dateObj);
  });

  // --- 9. Tag Cloud Collection ---
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
        slug: cat.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
        fontSize: Math.round(fontSize) + 'px'
      };
    });

    cloud.sort((a, b) => a.name.localeCompare(b.name));
    return cloud;
  });

  // --- 10. Directory Config ---
  return {
    pathPrefix: "/blog", 
    dir: {
      input: ".",          
      output: "_site",     
      includes: "_includes" 
    }
  };
};