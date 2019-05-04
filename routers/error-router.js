const BaseRouter = require('./base-router')
const LogHelper = require('../helpers/log-builder')

class ErrorRouter extends BaseRouter {
  constructor (router, log) {
    super(router, log, 'error-router')
  }

  errorHandler (err, req, res, next) {
    this._log.error(LogHelper.wrap('error', {
      req: req,
      err: err
    }))
    this._responseSender.error(res, err)
    next()
  }
}

module.exports = ErrorRouter
