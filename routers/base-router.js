const ResponseSender = require('../helpers/response-sender')

class BaseRouter {
  constructor (router, log, name) {
    this._router = router
    this._log = log.child({ module: name })

    this._responseSender = new ResponseSender(this._log)
  }

  get router () {
    return this._router
  }
}

module.exports = BaseRouter
