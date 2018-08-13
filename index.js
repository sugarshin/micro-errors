const { parse: parseUrl } = require('url')
const { send, createError } = require('micro')

module.exports.createError = (code, title, original, { type, detail, data } = {}) => {
  const error = createError(code, title, original)
  error.type = type
  error.title = title
  error.detail = detail
  error.data = data
  return error
}

module.exports.handleErrors = option => {
  const { debug } = Object.assign({ debug: false }, option)

  return fn => async (req, res, ...rest) => {
    try {
      return await fn(req, res, ...rest)
    } catch (e) {
      if (debug) {
        console.error(e.stack) // eslint-disable-line no-console
      }

      let { statusCode = 500 } = res
      if (e.statusCode) {
        statusCode = e.statusCode
      }

      if (statusCode < 400) {
        statusCode = 500
      }

      const payload = {
        type: e.type || 'about:blank',
        title: e.title,
        status: statusCode,
        instance: parseUrl(req.url).pathname,
      }

      const detail = e.detail || e.message
      if (detail) {
        payload.detail = detail
      }

      res.setHeader('Content-Type', 'application/problem+json')
      send(res, statusCode, Object.assign({}, e.data, payload))
    }
  }
}
