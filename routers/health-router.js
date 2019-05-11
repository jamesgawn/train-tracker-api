const BaseRouter = require('./base-router')

class HealthRouter extends BaseRouter {
  constructor (router, log) {
    super(router, log, 'health-router')

    this._router.get('/ping', this._ping.bind(this))
  }

  _ping (req, res, next) {
    this._responseSender.success('ping', req, res, 'pong')
    next()
  }
}

module.exports = HealthRouter
