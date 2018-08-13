# micro-error

A Error Handling for ZEIT's [Micro](https://github.com/zeit/micro).

```bash
yarn add micro-error
```

## RFC7807

RFC7807 compliant ref: https://tools.ietf.org/html/rfc7807

## Usage

```js
const { handleErrors, createError } = require('micro-error')

module.exports = handleErrors({ debug: true })(async (req, res) => {
  throw createError(400, 'Bad Request')
})

// HTTP/1.1 400 Bad Request
// Content-Type: application/problem+json
//
// {
//   "type": "about:blank",
//   "title": "Bad Request",
//   "status": 404,
//   "instance": "/foo",
//   "detail": "Invalid ID format"
// }
```

## License

[MIT][license-url]

© sugarshin

[license-image]: https://img.shields.io/:license-mit-blue.svg?style=flat-square
[license-url]: https://sugarshin.mit-license.org/
