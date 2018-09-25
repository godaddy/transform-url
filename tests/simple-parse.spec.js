const parse = require('../src/simple-parse');

describe('parse', () => {
  let results;

  beforeEach(() => {
    results = null;
  });

  it('parses url with query and hash', () => {
    results = parse('https://example.com?item=1234#somePlace');
    expect(results).toEqual({
      url: 'https://example.com',
      query: '?item=1234',
      hash: '#somePlace'
    });
  });

  it('parses url with query', () => {
    results = parse('https://example.com?item=1234');
    expect(results).toEqual({
      url: 'https://example.com',
      query: '?item=1234'
    });
  });

  it('parses url with hash', () => {
    results = parse('https://example.com#somePlace');
    expect(results).toEqual({
      url: 'https://example.com',
      hash: '#somePlace'
    });
  });

  it('parses url only', () => {
    results = parse('https://example.com');
    expect(results).toEqual({
      url: 'https://example.com'
    });
  });
});
