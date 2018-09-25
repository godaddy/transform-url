/**
 * Simple url parser to break apart base url, query, and hash elements
 *
 * @param {String} url - URL to parse
 * @returns {Object} parsed
 */
module.exports = function simpleParse(url) {
  const parsed = {};

  const q = url.indexOf('?');
  const h = url.indexOf('#');
  const hasQuery = !!~q;
  const hasHash = !!~h;

  parsed.url = url.slice(0, (hasQuery && q) || (hasHash && h) || url.length);
  if (hasQuery) parsed.query = url.slice(q, (hasHash && h) || url.length);
  if (hasHash) parsed.hash = url.slice(h);

  return parsed;
};
