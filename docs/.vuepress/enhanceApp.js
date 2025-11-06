/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData // site metadata
}) => {
  // Add schema markup for individual pages
  if (typeof window !== 'undefined') {
    router.afterEach((to) => {
      Vue.nextTick(() => {
        addPageSchema(to, siteData);
      });
    });
  }
}

function addPageSchema(route, siteData) {
  // Remove existing schema
  const existingSchema = document.querySelector('script[data-vue-schema]');
  if (existingSchema) {
    existingSchema.remove();
  }

  // Skip schema for non-content pages
  if (route.path === '/' || route.path.includes('404')) {
    return;
  }

  const pageData = route.matched[0]?.instances?.default?.$page;
  if (!pageData) return;

  const { title, frontmatter, path, regularPath } = pageData;
  const baseUrl = 'https://parkjju.github.io/vue-TIL';
  const fullUrl = baseUrl + path;

  // Determine category based on path
  let category = 'TechArticle';
  let about = ['Software Development', 'Programming'];
  
  if (path.includes('/swift/')) {
    about = ['Swift', 'iOS Development', 'Mobile Programming'];
  } else if (path.includes('/algorithm/')) {
    about = ['Algorithm', 'Data Structure', 'Problem Solving'];
  } else if (path.includes('/CS/')) {
    about = ['Computer Science', 'Network', 'Operating System'];
  } else if (path.includes('/react')) {
    about = ['React', 'Frontend Development', 'JavaScript'];
  } else if (path.includes('/vuepress/')) {
    about = ['VuePress', 'Documentation', 'Static Site Generator'];
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title || 'Technical Article',
    name: title || 'Technical Article',
    description: frontmatter.description || `${title}에 관한 기술 문서`,
    url: fullUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl
    },
    author: {
      '@type': 'Person',
      name: 'Parkjju',
      url: 'https://github.com/Parkjju'
    },
    publisher: {
      '@type': 'Person',
      name: 'Parkjju'
    },
    datePublished: frontmatter.date || new Date().toISOString().split('T')[0],
    dateModified: frontmatter.lastmod || frontmatter.date || new Date().toISOString().split('T')[0],
    inLanguage: 'ko-KR',
    about: about,
    keywords: frontmatter.tags || about,
    articleSection: 'Technology',
    isPartOf: {
      '@type': 'Blog',
      name: 'Today I Learned',
      url: baseUrl
    }
  };

  // Add schema to head
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-vue-schema', 'true');
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}
