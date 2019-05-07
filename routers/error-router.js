const BaseRouter = require('./base-router')

class ErrorRouter extends BaseRouter {
  constructor (router, log) {
    super(router, log, 'error-router')
  }

  uncaughtErrorHandler (err, req, res, next) {
    this._responseSender.error('uncaughtErrorHandler', req, res, err)
    next()
  }

  uriNotFound (req, res, next) {
    if (!res.finished) {
      this._responseSender.notFound('uriNotFound', req, res, 'The URI ' + req.url + ' is invalid.')
    }
    next()
  }
}

module.exports = ErrorRouter
