const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const expect = require('chai').expect
const DepartureBoardRouter = require('../../routers/departure-board-router')

describe('DepartureBoardRouter', () => {
  let router
  let rail
  let parentLog
  let log
  let responseSender
  let departureBoardRouter

  beforeEach(() => {
    router = {
      blah: true,
      get: sinon.fake(),
      use: sinon.fake()
    }
    rail = {
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
    departureBoardRouter = new DepartureBoardRouter(router, parentLog, rail)
    departureBoardRouter._responseSender = responseSender
  })

  describe('constructor', () => {
    it('should setup availabe URIs and map to internal methods to handle response', () => {
      expect(departureBoardRouter._rail).to.deep.equal(rail)
      expect(departureBoardRouter.router).to.deep.equal(router)
      expect(parentLog.child).to.be.calledWithExactly({
        module: 'departure-board-router'
      })
      expect(departureBoardRouter._log).to.deep.equal(log)

      // expect(router.get).to.be.calledWith('/:crsCode')
      // expect(router.get.firstCall.args[1].name).to.equal('bound _getStation')
    })
  })
})
