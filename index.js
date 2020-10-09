const Express = require('express')
const app = Express()

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

const port = normalizePort(process.env.PORT || '3000')

const fs = require('fs')
const version = fs.readFileSync('VERSION').toString().replace('\n', '')

const Bunyan = require('bunyan')
const log = new Bunyan({
  name: 'train-tracker-api',
  serializers: Bunyan.stdSerializers,
  src: true,
  version: version
})

const ConfigHelper = require('./helpers/config-helper')
const configHelper = new ConfigHelper(log)

const corsAllowedOrigins = configHelper.get('CORS_ALLOWED_ORIGINS', false)
if (corsAllowedOrigins !== null) {
  log.info('Setting Access-Control-Allow-Origin to ' + corsAllowedOrigins)
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', corsAllowedOrigins)
    next()
  })
}

const NationalRailData = require('national-rail-data')
const railData = new NationalRailData(configHelper.get('NRDP_USER'), configHelper.get('NRDP_PASS'))

const NationalRailDarwinPromise = require('national-rail-darwin-promise')
const rail = new NationalRailDarwinPromise(configHelper.get('DARWIN_TOKEN'))

const StationRouter = require('./routers/station-router')
app.use('/station', new StationRouter(Express.Router(), log, rail, railData).router)

const DepartureBoardRouter = require('./routers/departure-board-router')
app.use('/departureBoard', new DepartureBoardRouter(Express.Router(), log, rail).router)

const DepartureBoardWithDetailsRouter = require('./routers/departure-board-with-details-router')
app.use('/departureBoardWithDetails', new DepartureBoardWithDetailsRouter(Express.Router(), log, rail).router)

const HealthRouter = require('./routers/health-router')
app.use('/status', new HealthRouter(Express.Router(), log).router)

app.get('/favicon.ico', (req, res) => res.status(204))

const ErrorRouter = require('./routers/error-router')
const errorRouter = new ErrorRouter(Express.Router(), log)
app.use(errorRouter.uncaughtErrorHandler.bind(errorRouter))
app.use(errorRouter.uriNotFound.bind(errorRouter))

app.listen(port, () => {
  log.info(`Started listening on port ${port}!`)
})
