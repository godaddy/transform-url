/* eslint-disable max-statements */
const transformUrl = require('../src/index');

describe('transformUrl', () => {
  let params;

  beforeEach(() => {
    params = {
      id: 'user123',
      count: 777
    };
  });

  it('returns an unmodified url', () => {
    const url = 'http://example.com/api/items';
    expect(transformUrl(url))
      .toEqual(url);
  });

  it('returns a modified url with url params', () => {
    const url = 'http://example.com/api/items/:id/:count';
    expect(transformUrl(url, params))
      .toEqual('http://example.com/api/items/user123/777');
  });

  it('returns a modified url with query params', () => {
    const url = 'http://example.com/api/items/:id';
    expect(transformUrl(url, params))
      .toEqual('http://example.com/api/items/user123?count=777');
  });

  it('allows predefined query params in template', () => {
    const url = 'http://example.com/api/items/:id?force=true';
    expect(transformUrl(url, params))
      .toEqual('http://example.com/api/items/user123?count=777&force=true');
  });

  it('allows duplicate predefined params in template', () => {
    const url = 'http://example.com/api/items/:id?id=:id';
    expect(transformUrl(url, params))
      .toEqual('http://example.com/api/items/user123?count=777&id=user123');
  });

  it('allows arrays for query params', () => {
    const url = 'http://example.com/api/items/:id?id=:id';
    params = { ...params, multi: ['one', 'two'] };
    expect(transformUrl(url, params))
      .toEqual('http://example.com/api/items/user123?count=777&id=user123&multi=one&multi=two');
  });

  it('param values are encoded', () => {
    const url = 'http://example.com/api/items/:id?id=:id';
    params = { ...params, id: 'über+user' };
    expect(transformUrl(url, params))
      .toEqual('http://example.com/api/items/%C3%BCber%2Buser?count=777&id=%C3%BCber%2Buser');
  });

  it('allows hashes in template url', () => {
    const url = 'http://example.com/api/items/:id?force=true#someHash';
    expect(transformUrl(url, params))
      .toEqual('http://example.com/api/items/user123?count=777&force=true#someHash');
  });

  it('allows hashes to be parameterized', () => {
    const url = 'http://example.com/api/items/:id?force=true#:hash';
    expect(transformUrl(url, { ...params, hash: 'someHash' }))
      .toEqual('http://example.com/api/items/user123?count=777&force=true#someHash');
  });

  it('throws an error with unmet path param', () => {
    const url = 'http://example.com/api/items/:someMissingParam';
    expect(() => transformUrl(url, params)).toThrow();
  });

  it('throws an error with unmet base param', () => {
    const url = 'http://{someMissingParam}/api/items';
    expect(() => transformUrl(url, params)).toThrow();
  });

  it('allows for port number in url', () => {
    const url = 'http://example.com:8080/api/items/:id';
    expect(transformUrl(url, params))
      .toEqual('http://example.com:8080/api/items/user123?count=777');
  });

  it('returns a url with hostname substituted', () => {
    const url = 'http://{hostname}:8080/api/vms/:vmId/actions/:actionId?q1=:q1&q2=:q2&q3=q3';
    const expectedUrl = 'http://test.com:8080/api/vms/foo/actions/bar?q1=hello&q2=world&q3=q3';
    const params1 = { vmId: 'foo', actionId: 'bar', q1: 'hello', q2: 'world', hostname: 'test.com' };
    expect(transformUrl(url, params1))
      .toEqual(expectedUrl);
  });

  it('returns a url with port substituted', () => {
    const url = 'http://hostname.com:{port}/api/vms/:vmId/actions/:actionId?q1=:q1&q2=:q2&q3=q3';
    const expectedUrl = 'http://hostname.com:8443/api/vms/foo/actions/bar?q1=hello&q2=world&q3=q3';
    const params1 = { vmId: 'foo', actionId: 'bar', q1: 'hello', q2: 'world', port: '8443' };
    expect(transformUrl(url, params1))
      .toEqual(expectedUrl);
  });

  it('port param can be a number', () => {
    const url = 'http://hostname.com:{port}/api/vms/:vmId/actions/:actionId?q1=:q1&q2=:q2&q3=q3';
    const expectedUrl = 'http://hostname.com:8443/api/vms/foo/actions/bar?q1=hello&q2=world&q3=q3';
    const params1 = { vmId: 'foo', actionId: 'bar', q1: 'hello', q2: 'world', port: 8443 };
    expect(transformUrl(url, params1))
      .toEqual(expectedUrl);
  });

  it('returns a url with scheme substituted', () => {
    const url = '{scheme}://hostname.com:8080/api/vms/:vmId/actions/:actionId?q1=:q1&q2=:q2&q3=q3';
    const expectedUrl = 'https://hostname.com:8080/api/vms/foo/actions/bar?q1=hello&q2=world&q3=q3';
    const params1 = { vmId: 'foo', actionId: 'bar', q1: 'hello', q2: 'world', scheme: 'https' };
    expect(transformUrl(url, params1))
      .toEqual(expectedUrl);
  });

  it('returns a relative url with variables substituted', () => {
    const url = '/api/items/:id/:count';
    expect(transformUrl(url, params))
      .toEqual('/api/items/user123/777');
  });

  it('returns a protocol relative url with variables substituted', () => {
    const url = '//{hostname}/api/items/:id/:count';
    expect(transformUrl(url, { ...params, hostname: 'test.com' }))
      .toEqual('//test.com/api/items/user123/777');
  });

  it('path and query params are strict encoded', () => {
    const url = 'http://example.com/api/items/:id?id=:id';
    params = { ...params, id: 'über+user!' };
    expect(transformUrl(url, params, { strictEncode: true }))
      .toEqual('http://example.com/api/items/%C3%BCber%2Buser%21?count=777&id=%C3%BCber%2Buser%21');
  });

  describe('default matchers', () => {

    it('supports colon-prefixed params', () => {
      const url = '//:hostname/api/items/:id/:count';
      expect(transformUrl(url, { ...params, hostname: 'test.com' }))
        .toEqual('//test.com/api/items/user123/777');
    });

    it('colon-prefixed ignore separator and port', () => {
      const url = 'https://:hostname:8080/api/items/:id/:count';
      expect(transformUrl(url, { ...params, hostname: 'test.com' }))
        .toEqual('https://test.com:8080/api/items/user123/777');
    });

    it('supports curly brackets params', () => {
      const url = '//{hostname}/api/items/{id}/{count}';
      expect(transformUrl(url, { ...params, hostname: 'test.com' }))
        .toEqual('//test.com/api/items/user123/777');
    });

    it('curly brackets matches for scheme and port', () => {
      const url = '{scheme}://{hostname}:{port}/api/items/{id}/{count}';
      expect(transformUrl(url, { ...params, hostname: 'test.com', scheme: 'ftp', port: '3000' }))
        .toEqual('ftp://test.com:3000/api/items/user123/777');
    });

    it('colon-prefix and curly brackets params can be mixed', () => {
      const url = '{scheme}://{hostname}:{port}/api/items/:id/:count';
      expect(transformUrl(url, { ...params, hostname: 'test.com', scheme: 'ftp', port: '3000' }))
        .toEqual('ftp://test.com:3000/api/items/user123/777');
    });

    it('colon-prefix and curly brackets params can be mixed again', () => {
      const url = ':scheme://:hostname::port/api/items/{id}/{count}';
      expect(transformUrl(url, { ...params, hostname: 'test.com', scheme: 'ftp', port: '3000' }))
        .toEqual('ftp://test.com:3000/api/items/user123/777');
    });
  });

  describe('options', () => {

    describe('matcher', () => {

      it('custom matcher can be used', () => {
        const url = '$scheme://$hostname:$port/api/items/$id/$count';
        params = { ...params, hostname: 'test.com', scheme: 'ftp', port: '3000', extra: 'value' };
        const options = { matcher: /\$(\w+)/g };
        expect(transformUrl(url, params, options))
          .toEqual('ftp://test.com:3000/api/items/user123/777?extra=value');
      });

      it('custom matcher can be mixed with originals', () => {
        const url = '{scheme}://$hostname:$port/api/items/:id/$count';
        params = { ...params, hostname: 'test.com', scheme: 'ftp', port: '3000', extra: 'value' };
        const options = { matcher: /\$(\w+)/g };
        expect(transformUrl(url, params, options))
          .toEqual('ftp://test.com:3000/api/items/user123/777?extra=value');
      });
    });
  });
});
