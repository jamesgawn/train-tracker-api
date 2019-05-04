const BaseRouter = require('./base-router')

class BaseRailRouter extends BaseRouter {
  constructor (router, log, name, rail) {
    super(router, log, name)
    this._rail = rail
  }
}

module.exports = BaseRailRouter
