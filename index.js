const { parse: parseUrl } = require('url')
const { send, createError } = require('micro')

module.exports.createError = (code, title, originalError, type, details) => {
  const error = createError(code, title, originalError)
  error.title = title
  error.type = type || 'about:blank'
  error.details = details
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
        type: e.type,
        title: e.title,
        status: statusCode,
        instance: parseUrl(req.url).pathname,
      }

      const details = e.message ? Object.assign({ detail: e.message }, e.details) : e.details

      res.setHeader('Content-Type', 'application/problem+json')
      send(res, statusCode, Object.assign({}, details, payload))
    }
  }
}
