const BaseRailRouter = require('./base-rail-router')

class StationRouter extends BaseRailRouter {
  constructor (router, log, rail, railData) {
    super(router, log, 'station-router', rail)

    this._railData = railData
    this._router.get('/', this._getAll.bind(this))
    this._router.get('/:crsCode', this._getStation.bind(this))
  }
  async _getAll (req, res, next) {
    try {
      let stations = await this._railData.getStations()
      this._responseSender.success('getAll', req, res, stations)
      next()
    } catch (err) {
      this._responseSender.error('getAll', req, res, err)
      next()
    }
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
