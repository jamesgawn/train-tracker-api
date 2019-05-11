const BaseRailRouter = require('./base-rail-router')

class DepartureBoardRouter extends BaseRailRouter {
  constructor (router, log, rail) {
    super(router, log, 'departure-board-router', rail)
  }
}

module.exports = DepartureBoardRouter
