# TransformURL [![Version npm](https://img.shields.io/npm/v/transform-url.svg?style=flat-square)](https://www.npmjs.com/package/transform-url)[![Build Status](https://img.shields.io/travis/com/godaddy/transform-url/master.svg?style=flat-square)](https://travis-ci.com/godaddy/transform-url)[![Dependencies](https://img.shields.io/david/godaddy/transform-url.svg?style=flat-square)](https://david-dm.org/godaddy/transform-url)[![Coverage Status](https://img.shields.io/coveralls/godaddy/transform-url/master.svg?style=flat-square)](https://coveralls.io/r/godaddy/transform-url?branch=master)

Build URLs by transforming a template with params.

## Installation

```bash
yarn add transform-url
```
or
```bash
npm install --save transform-url
```

## Usage

### Query params

The first argument to `transformUrl` is a URL template, with the second being
a params object of key/value pairs.

```js
const transformUrl = require('transform-url');
const params = {
  userId: 'user-1234',
  orderId: 'order-6789'
};

const url = transformUrl('https://example.com', params);
// https://example.com?orderId=order-6789&userId=user-1234
```

### Path params

If you want some params to be applied as path params, add placeholders to the
URL template.

```js
const url = transformUrl('https://example.com/api/users/:userId/orders/:orderId', params);
// https://example.com/api/users/user-1234/orders/order-6789
```

### Mixed params

Any remaining params not specified in the URL template, will be applied as
query params.

```js
const url = transformUrl('https://example.com/api/users/:userId', params);
// https://example.com/api/users/user-1234?orderId=order-6789
```

### Other params

Besides path and query params, placeholders can be added to any other part of
the URL template.

```js
const moreParams = {
  ...params,
  scheme: 'https',
  domain: 'example.com',
  hash: 'somePlace'
};

const url = transformUrl('{scheme}://{domain}/api/users/:userId#{hash}', moreParams);
// https://example.com/api/users/user-1234?orderId=order-6789#somePlace
```

### Matchers

URL template placeholders can use either `:colon` or `{curlyBraces}` matchers.
Additionally, it is possible to provide a custom matcher via options.

```js
const options = {
  matcher: /\$(\w+)/g   // match `$paramName`
};

const url = transformUrl('$scheme://$domain/api/users/$userId#$hash', moreParams, options);
// https://example.com/api/users/user-1234?orderId=order-6789#somePlace
```

For additional options, see the API Reference below.

## API Reference
<a name="transformUrl"></a>

## transformUrl(urlTemplate, params, [options]) ⇒ <code>String</code>
Transform URL templates with provided params.
Params that are not placeholders in the url template will be append as query params.
Urls with a port number will be respected, for example `http://example.com:8080`

**Kind**: global function  
**Returns**: <code>String</code> - transformed url  

| Param | Type | Description |
| --- | --- | --- |
| urlTemplate | <code>String</code> | URL template to be transformed with params. URL template placeholders can use either `:colon` or `{curlyBraces}` matchers. |
| params | <code>Object</code> | Key/value pairs to be applied as path and/or query params. Required to include params for all placeholders. |
| [options] | <code>Object</code> | Optional configuration to output results. |
| [options.matcher] | <code>RegExp</code> | Specify regular expression for custom placeholders in URL templates. |


<!-- Links -->
[encodeURIComponent]:https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
[strict-uri-encode]:https://github.com/kevva/strict-uri-encode
