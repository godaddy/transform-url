/**
 * @jest-environment node
 */
/* eslint-disable no-new */

const ponyfill = require('@ungap/url-search-params');
jest.mock('@ungap/url-search-params');
const URLSearchParams = require('../src/url-search-params');

describe('URLSearchParams', () => {
  it('uses ponyfill URLSearchParams', () => {
    new URLSearchParams();
    expect(ponyfill).toHaveBeenCalled();
  });
});
