/* eslint-disable max-statements,no-cond-assign */

const parse = require('./simple-parse');
const URLSearchParams = require('./url-search-params');

const defaultRegex = [
  /{([\w]+)}/g,
  /:([a-zA-Z][\w]+)/g
];

/**
 * Provides consistent encoding with URLSearchParams and adhering to RFC 3986.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
 *
 * @param {String} str - Component to encode
 * @returns {String} - encoded component
 * @private
 */
const fixedEncodeURIComponent = str => encodeURIComponent(str).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16));

/**
 * Transform URL templates with provided params.
 * Params that are not placeholders in the url template will be append as query params.
 * Urls with a port number will be respected, for example `http://example.com:8080`
 *
 * @param {String} urlTemplate - URL template to be transformed with params.
 * URL template placeholders can use either `:colon` or `{curlyBraces}` matchers.
 * @param {Object} params - Key/value pairs to be applied as path and/or query params.
 * Required to include params for all placeholders.
 * @param {Object} [options] - Optional configuration to output results.
 * @param {RegExp} [options.matcher] - Specify regular expression for custom placeholders in URL templates.
 * @returns {String} transformed url
 */
function transformUrl(urlTemplate, params = {}, options = {}) {

  const { matcher } = options;
  const matchers = matcher ? [matcher, ...defaultRegex] : defaultRegex;
  const matches = [];
  const usedParams = [];

  /**
   * Get the value for a param key and mark it as used.
   *
   * @param {String} key - Param name
   * @returns {String} value
   * @private
   */
  const getParamValue = (key) => {
    if (key in params) {
      usedParams.push(key);
      return params[key];
    }
    throw new Error(`Param (${key}) not provided for url template: ${urlTemplate}`);
  };

  //
  // Find all matches in the url template from matchers
  //
  matchers.forEach(m => {
    const re = new RegExp(m);
    let match;
    while ((match = re.exec(urlTemplate)) != null) {
      matches.push(match);
    }
  });

  //
  // Substitute all placeholders in url template with encode param values
  //
  const replacedUrl = matches.reduce((acc, cur) => {
    const full = cur[0];
    const key = cur[1];
    const value = getParamValue(key);
    return acc.replace(full, fixedEncodeURIComponent(value));
  }, urlTemplate);

  const { url: urlPart, query, hash: hashPart = '' } = parse(replacedUrl);

  const searchParams = new URLSearchParams(query);

  //
  // Add all remaining params and arrays to query string
  //
  Object.keys(params).forEach(key => {
    if (usedParams.indexOf(key) < 0) {
      const values = params[key];
      (Array.isArray(values) ? values : [values]).forEach(value => {
        searchParams.append(key, value);
      });
    }
  });

  searchParams.sort();
  let queryPart = searchParams.toString();
  queryPart = queryPart ? '?' + queryPart : '';

  return `${urlPart}${queryPart}${hashPart}`;
}

module.exports = transformUrl;
