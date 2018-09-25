/* eslint-disable no-new */

const nativeSpy = jest.spyOn(global, 'URLSearchParams');
const ponyfill = require('url-search-params');
jest.mock('url-search-params');
const URLSearchParams = require('../src/url-search-params');

describe('URLSearchParams', () => {
  it('uses native URLSearchParams', () => {
    new URLSearchParams();
    expect(nativeSpy).toHaveBeenCalled();
  });
  it('does not use ponyfill URLSearchParams', () => {
    new URLSearchParams();
    expect(ponyfill).not.toHaveBeenCalled();
  });
});
