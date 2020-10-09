const BaseRailRouter = require('./base-rail-router')
const NodeCache = require('node-cache')

class StationRouter extends BaseRailRouter {
  constructor (router, log, rail, railData) {
    super(router, log, 'station-router', rail)

    this._railData = railData
    this._router.get('/', this._getAll.bind(this))
    this._router.get('/:crsCode', this._getStation.bind(this))
    this._cache = new NodeCache()
  }

  async _getAll (req, res, next) {
    try {
      const stations = await this._cache.get('stations')
      if (typeof stations !== 'undefined') {
        this._responseSender.success('getAll', req, res, stations)
      } else {
        const stations = await this._railData.getStations()
        this._cache.set('stations', stations, 60 * 60 * 24)
        this._responseSender.success('getAll', req, res, stations)
      }
      next()
    } catch (err) {
      this._responseSender.error('getAll', req, res, err)
      next()
    }
  }

  async _getStation (req, res, next) {
    try {
      const crsCode = req.params.crsCode
      const stations = await this._rail.getStationDetails(crsCode)
      if (stations.length > 0) {
        this._responseSender.success('getStation', req, res, stations)
      } else {
        const msg = 'Unable to find station ' + crsCode
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
