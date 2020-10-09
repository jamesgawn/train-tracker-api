const BaseRailRouter = require('./base-rail-router')

class ServiceRailRouter extends BaseRailRouter {
  constructor (router, log, rail, name, method) {
    super(router, log, name, rail)

    this._method = method
    this._router.get('/:crsCode', this._get.bind(this))
    this._router.get('/:crsCode/:destination', this._getWithDestination.bind(this))
  }

  async _get (req, res, next) {
    try {
      const crsCode = req.params.crsCode
      const board = await this._method(crsCode)
      this._responseSender.success('get', req, res, board)
      next()
    } catch (err) {
      this._responseSender.error('get', req, res, err)
      next()
    }
  }

  async _getWithDestination (req, res, next) {
    try {
      const crsCode = req.params.crsCode
      const destination = req.params.destination
      const board = await this._method(crsCode, {
        destination: destination
      })
      this._responseSender.success('getWithDestination', req, res, board)
      next()
    } catch (err) {
      this._responseSender.error('getWithDestination', req, res, err)
      next()
    }
  }
}

module.exports = ServiceRailRouter
