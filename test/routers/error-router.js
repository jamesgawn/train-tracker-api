const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const expect = require('chai').expect
const ErrorRouter = require('../../routers/error-router')

describe('ErrorRouter', () => {
  let router
  let parentLog
  let log
  let errorRouter
  let responseSender
  let next
  let res
  let req

  beforeEach(() => {
    router = {
      blah: true,
      get: sinon.fake(),
      use: sinon.fake()
    }
    log = {
    }
    parentLog = {
      child: sinon.fake.returns(log)
    }
    responseSender = {
      error: sinon.fake(),
      notFound: sinon.fake()
    }
    req = {
      params: {
        crsCode: 'GNW'
      },
      url: '/bas'
    }
    res = {}
    next = sinon.spy()
    errorRouter = new ErrorRouter(router, parentLog)
    errorRouter._responseSender = responseSender
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

  describe('uncaughtErrorHandler', () => {
    it('should log error and respond with error json response', async () => {
      const err = {
        error: true
      }

      await errorRouter.uncaughtErrorHandler(err, req, res, next)
      expect(responseSender.error).to.be.calledWithExactly('uncaughtErrorHandler', req, res, err)
      expect(next.callCount).to.be.equal(1)
    })
  })
  describe('uriNotFound', () => {
    it('should respond with not found for uri not configured', async () => {
      res.finished = false
      await errorRouter.uriNotFound(req, res, next)
      expect(responseSender.notFound).to.be.calledWithExactly('uriNotFound', req, res, 'The URI /bas is invalid.')
      expect(next.callCount).to.be.equal(1)
    })
    it('should not attempt to respond with not found when response already processed', async () => {
      res.finished = true
      await errorRouter.uriNotFound(req, res, next)
      expect(responseSender.notFound.callCount).to.be.equal(0)
      expect(next.callCount).to.be.equal(1)
    })
  })
})
