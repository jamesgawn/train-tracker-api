const BaseRouter = require('./base-rail-router')
const LogBuilder = require('../helpers/log-builder')

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
        this._log.info(LogBuilder.wrapRequestWithMessage('Retrieved station ' + crsCode, req))
        this._responseSender.success(res, stations)
      } else {
        let message = 'Unable to find station ' + crsCode
        this._log.info(LogBuilder.wrapRequestWithMessage(message, req))
        this._responseSender.notFound(res, message)
      }
      next()
    } catch (err) {
      let message = 'Unable to find station'
      this._log.error(LogBuilder.wrapRequestError(message, req, err))
      this._responseSender.error(res, message)
      next()
    }
  }
}

module.exports = StationRouter
