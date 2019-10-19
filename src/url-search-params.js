let URLSearchParams = (typeof window !== 'undefined') && window.URLSearchParams;
if (!URLSearchParams) {
  URLSearchParams = require('@ungap/url-search-params/cjs');
}

module.exports = URLSearchParams;
