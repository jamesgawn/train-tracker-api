const BaseRailRouter = require('./service-rail-router')

class DepartureBoardRouter extends BaseRailRouter {
  constructor (router, log, rail) {
    super(router, log, rail, 'departure-board-with-details-router', rail.getDepartureBoardWithDetails.bind(rail))
  }
}

module.exports = DepartureBoardRouter
