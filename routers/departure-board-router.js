const BaseRailRouter = require('./base-rail-router')

class DepartureBoardRouter extends BaseRailRouter {
  constructor (router, log, rail) {
    super(router, log, 'departure-board-router', rail)

    this._router.get('/:crsCode', this._getDepartureBoard.bind(this))
    this._router.get('/:crsCode/:destination', this._getDepartureBoardWithDestination.bind(this))
  }

  async _getDepartureBoard (req, res, next) {
    try {
      let crsCode = req.params.crsCode
      let board = await this._rail.getDepartureBoard(crsCode)
      this._responseSender.success('getDepartureBoard', req, res, board)
      next()
    } catch (err) {
      this._responseSender.error('getDepartureBoard', req, res, err)
      next()
    }
  }

  async _getDepartureBoardWithDestination (req, res, next) {
    try {
      let crsCode = req.params.crsCode
      let destination = req.params.destination
      let board = await this._rail.getDepartureBoard(crsCode, {
        destination: destination
      })
      this._responseSender.success('getDepartureBoardWithDestination', req, res, board)
      next()
    } catch (err) {
      this._responseSender.error('getDepartureBoardWithDestination', req, res, err)
      next()
    }
  }
}

module.exports = DepartureBoardRouter
