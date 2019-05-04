// const LogBuilder = require('../helpers/log-builder')

class BaseRouter {
  constructor (router, log, name) {
    this._router = router
    this._log = log.child({ module: name })

    this._responseSender = require('../helpers/response-sender')
  }

  get router () {
    return this._router
  }
}

module.exports = BaseRouter
