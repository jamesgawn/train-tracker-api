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
let version = fs.readFileSync('VERSION').toString().replace('\n', '')

const Bunyan = require('bunyan')
let log = new Bunyan({
  name: 'train-tracker-api',
  serializers: Bunyan.stdSerializers,
  src: true,
  version: version
})

const AWSHelper = require('./helpers/aws-helper')
const ConfigHelper = require('./helpers/config-helper')
let configHelper = new ConfigHelper(log, new AWSHelper())

const NationalRailDarwinPromise = require('national-rail-darwin-promise')
const rail = new NationalRailDarwinPromise(configHelper.get('DARWIN_TOKEN'))

const StationRouter = require('./routers/station-router')
app.use('/station', new StationRouter(Express.Router(), log, rail).router)

const ErrorRouter = require('./routers/error-router')
let errorRouter = new ErrorRouter(Express.Router(), log)
app.use(errorRouter.uncaughtErrorHandler.bind(errorRouter))
app.use(errorRouter.uriNotFound.bind(errorRouter))

app.listen(port, () => {
  log.info(`Started listening on port ${port}!`)
})
