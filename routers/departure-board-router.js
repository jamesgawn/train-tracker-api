const BaseRailRouter = require('./service-rail-router')

class DepartureBoardRouter extends BaseRailRouter {
  constructor (router, log, rail) {
    super(router, log, rail, 'departure-board-router', rail.getDepartureBoard)
  }
}

module.exports = DepartureBoardRouter
