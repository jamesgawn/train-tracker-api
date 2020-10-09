const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const expect = require('chai').expect
const HealthRouter = require('../../routers/health-router')

describe('HealthRouter', () => {
  let router
  let parentLog
  let log
  let responseSender
  let healthRouter

  beforeEach(() => {
    router = {
      blah: true,
      get: sinon.fake(),
      use: sinon.fake()
    }
    log = {
      info: sinon.spy(),
      error: sinon.spy()
    }
    parentLog = {
      child: sinon.fake.returns(log)
    }
    responseSender = {
      notFound: sinon.fake(),
      success: sinon.fake(),
      error: sinon.fake()
    }
    healthRouter = new HealthRouter(router, parentLog)
    healthRouter._responseSender = responseSender
  })

  describe('constructor', () => {
    it('should setup availabe URIs and map to internal methods to handle response', () => {
      expect(healthRouter.router).to.deep.equal(router)
      expect(parentLog.child).to.be.calledWithExactly({
        module: 'health-router'
      })
      expect(healthRouter._log).to.deep.equal(log)

      expect(router.get).to.be.calledWith('/ping')
      expect(router.get.firstCall.args[1].name).to.equal('bound _ping')
    })
  })

  describe('_ping', () => {
    it('should respond pong', async () => {
      const req = {}
      const res = {}
      const next = sinon.spy()
      await healthRouter._ping(req, res, next)
      expect(responseSender.success).to.be.calledWithExactly('ping', req, res, 'pong')
      expect(next.callCount).to.be.equal(1)
    })
  })
})
