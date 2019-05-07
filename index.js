const Express = require('express')
const app = Express()

const NationallRailDarwinPromise = require('national-rail-darwin-promise')
const rail = new NationallRailDarwinPromise()

const port = normalizePort(process.env.PORT || '3000')

const Bunyan = require('bunyan')
let log = new Bunyan({
  name: 'train-tracker-api',
  serializers: Bunyan.stdSerializers,
  src: true
})

const StationRouter = require('./routers/station-router')
app.use('/station', new StationRouter(Express.Router(), log, rail).router)

const ErrorRouter = require('./routers/error-router')
let errorRouter = new ErrorRouter(Express.Router(), log)
app.use(errorRouter.uncaughtErrorHandler.bind(errorRouter))
app.use(errorRouter.uriNotFound.bind(errorRouter))

app.listen(port, () => {
  log.info(`Train Tracker APIs are listening on port ${port}!`)
})

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
