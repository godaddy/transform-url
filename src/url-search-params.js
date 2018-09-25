let URLSearchParams = (typeof window !== 'undefined') && window.URLSearchParams;
if (!URLSearchParams) {
  URLSearchParams = require('url-search-params');
}

module.exports = URLSearchParams;
