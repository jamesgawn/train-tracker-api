const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const expect = require('chai').expect
const ErrorRouter = require('../../routers/error-router')
const LogHelper = require('../../helpers/log-builder')

describe('ErrorRouter', () => {
  let router
  let parentLog
  let log
  let errorRouter

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
    errorRouter = new ErrorRouter(router, parentLog)
  })

  describe('constructor', () => {
    it('should setup availabe URIs and map to internal methods to handle response', () => {
      expect(errorRouter.router).to.deep.equal(router)
      expect(parentLog.child).to.be.calledWithExactly({
        module: 'error-router'
      })
      expect(errorRouter._log).to.deep.equal(log)
    })
  })

  describe('errorHandler', () => {
    it('should log error and respond with error json response', async () => {
      let req = {
        baseUrl: undefined,
        headers: undefined,
        httpVersion: undefined,
        method: undefined,
        originalUrl: undefined,
        params: {
          crsCode: 'GNW'
        },
        query: undefined,
        url: undefined
      }
      let res = {}
      let responseSender = {
        error: sinon.fake()
      }
      let err = {
        error: true
      }
      errorRouter._responseSender = responseSender
      let next = sinon.spy()
      await errorRouter.errorHandler(err, req, res, next)
      expect(log.error).to.be.calledWithExactly(LogHelper.wrap('error', {
        req: req,
        err: err
      }))
      expect(responseSender.error).to.be.calledWithExactly(res, err)
      expect(next.callCount).to.be.equal(1)
    })
  })
})
