const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const expect = require('chai').expect
const BaseRailRouter = require('../../routers/base-rail-router')
// const LogBuilder = require('../../helpers/log-builder')

describe('BaseRailRouter', () => {
  let router
  let baseRouter
  let rail
  let parentLog
  let log

  beforeEach(() => {
    router = {
      blah: true,
      get: sinon.fake(),
      use: sinon.fake()
    }
    rail = {
      getStationDetails: sinon.fake()
    }
    log = {
      info: sinon.spy()
    }
    parentLog = {
      child: sinon.fake.returns(log)
    }
    baseRouter = new BaseRailRouter(router, parentLog, 'test', rail)
  })

  describe('constructor', () => {
    it('should store national rail darwin service', () => {
      expect(baseRouter._rail).to.deep.equal(rail)
      expect(baseRouter.router).to.deep.equal(router)

      expect(parentLog.child).to.be.calledWithExactly({
        module: 'test'
      })
      expect(baseRouter._log).to.deep.equal(log)
    })
  })
})
