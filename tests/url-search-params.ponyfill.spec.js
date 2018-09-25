/**
 * @jest-environment node
 */
/* eslint-disable no-new */

const ponyfill = require('url-search-params');
jest.mock('url-search-params');
const URLSearchParams = require('../src/url-search-params');

describe('URLSearchParams', () => {
  it('uses ponyfill URLSearchParams', () => {
    new URLSearchParams();
    expect(ponyfill).toHaveBeenCalled();
  });
});
