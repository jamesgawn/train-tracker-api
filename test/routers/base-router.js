const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const expect = require('chai').expect
const BaseRouter = require('../../routers/base-router')
const ResponseSender = require('../../helpers/response-sender')

describe('BaseRouter', () => {
  let router
  let baseRouter
  let parentLog
  let log

  beforeEach(() => {
    router = {
      blah: true,
      get: sinon.fake(),
      use: sinon.fake()
    }
    log = {
      info: sinon.spy()
    }
    parentLog = {
      child: sinon.fake.returns(log)
    }
    baseRouter = new BaseRouter(router, parentLog, 'test')
  })

  describe('constructor', () => {
    it('should store national rail darwin service', () => {
      expect(baseRouter.router).to.deep.equal(router)

      expect(parentLog.child).to.be.calledWithExactly({
        module: 'test'
      })
      expect(baseRouter._log).to.deep.equal(log)
      expect(baseRouter._responseSender).to.deep.equal(new ResponseSender(baseRouter._log))
    })
  })
})
