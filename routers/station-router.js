const BaseRouter = require('./base-rail-router')

class StationRouter extends BaseRouter {
  constructor (router, log, rail) {
    super(router, log, 'station-router', rail)

    this._router.get('/:crsCode', this._getStation.bind(this))
  }

  async _getStation (req, res, next) {
    try {
      let crsCode = req.params.crsCode
      let stations = await this._rail.getStationDetails(crsCode)
      if (stations.length > 0) {
        this._responseSender.success('getStation', req, res, stations)
      } else {
        let msg = 'Unable to find station ' + crsCode
        this._responseSender.notFound('getStation', req, res, msg)
      }
      next()
    } catch (err) {
      this._responseSender.error('getStation', req, res, err)
      next()
    }
  }
}

module.exports = StationRouter
