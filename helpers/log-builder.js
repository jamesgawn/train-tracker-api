class LogBuilder {
  static wrap (message, detail) {
    return {
      detail: detail,
      msg: message
    }
  }
  static wrapRequestWithMessage (message, req) {
    return {
      detail: {
        req: this._trimRequest(req)
      },
      msg: message
    }
  }
  static wrapRequest (req) {
    return {
      detail: {
        req: this._trimRequest(req)
      }
    }
  }
  static wrapRequestError (message, req, err) {
    return {
      detail: {
        req: this._trimRequest(req),
        err: err
      },
      msg: message
    }
  }
  static _trimRequest (req) {
    let trimmedReq = {}

    if (typeof req.baseUrl !== 'undefined') {
      trimmedReq.baseUrl = req.baseUrl
    }
    if (typeof req.headers !== 'undefined') {
      trimmedReq.headers = req.headers
    }
    if (typeof req.method !== 'undefined') {
      trimmedReq.method = req.method
    }
    if (typeof req.httpVersion !== 'undefined') {
      trimmedReq.httpVersion = req.httpVersion
    }
    if (typeof req.originalUrl !== 'undefined') {
      trimmedReq.originalUrl = req.originalUrl
    }
    if (typeof req.params !== 'undefined') {
      trimmedReq.params = req.params
    }
    if (typeof req.query !== 'undefined') {
      trimmedReq.query = req.query
    }
    if (typeof req.url !== 'undefined') {
      trimmedReq.url = req.url
    }
    return trimmedReq
  }
}

module.exports = LogBuilder
