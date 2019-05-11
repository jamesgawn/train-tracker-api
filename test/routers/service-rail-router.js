const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const expect = require('chai').expect
const ServiceRailRouter = require('../../routers/service-rail-router')

describe('ServiceRaillRouter', () => {
  let router
  let rail
  let parentLog
  let log
  let responseSender
  let serviceRailRouter
  let res
  let next

  beforeEach(() => {
    router = {
      blah: true,
      get: sinon.fake(),
      use: sinon.fake()
    }
    rail = {
      getDepartureBoard: sinon.stub(),
      getDepartureBoardWithDetails: sinon.stub()
    }
    log = {
      info: sinon.spy(),
      error: sinon.spy()
    }
    parentLog = {
      child: sinon.fake.returns(log)
    }
    res = { }
    next = sinon.spy()
    responseSender = {
      notFound: sinon.fake(),
      success: sinon.fake(),
      error: sinon.fake()
    }
    serviceRailRouter = new ServiceRailRouter(router, parentLog, rail, 'departure-board-router', rail.getDepartureBoard, rail.getDepartureBoardWithDetails)
    serviceRailRouter._responseSender = responseSender
  })

  describe('constructor', () => {
    it('should setup availabe URIs and map to internal methods to handle response', () => {
      expect(serviceRailRouter._rail).to.deep.equal(rail)
      expect(serviceRailRouter.router).to.deep.equal(router)
      expect(serviceRailRouter._method).to.deep.equal(rail.getDepartureBoard)
      expect(parentLog.child).to.be.calledWithExactly({
        module: 'departure-board-router'
      })
      expect(serviceRailRouter._log).to.deep.equal(log)

      expect(router.get).to.be.calledWith('/:crsCode')
      expect(router.get.firstCall.args[1].name).to.equal('bound _get')
      expect(router.get).to.be.calledWith('/:crsCode/:destination')
      expect(router.get.secondCall.args[1].name).to.equal('bound _getWithDestination')
    })
  })
  describe('methods', () => {
    describe('_get', () => {
      it('should respond with a response for a valid request to the method ', async () => {
        let expectedResult = require('./exampleData/departureBoardWithDetails')
        rail.getDepartureBoard.resolves(expectedResult)
        let req = {
          params: {
            crsCode: 'GNW'
          }
        }
        await serviceRailRouter._get(req, res, next)
        expect(rail.getDepartureBoard).to.be.calledWithExactly('GNW')
        expect(responseSender.success).to.be.calledWithExactly('get', req, res, expectedResult)
        expect(next.callCount).to.be.equal(1)
      })
      it('should respond with 500 error when exception occurs', async () => {
        let err = {
          error: true
        }
        rail.getDepartureBoard.rejects(err)
        let req = {
          params: {
            crsCode: 'BLAH'
          }
        }
        await serviceRailRouter._get(req, res, next)
        expect(rail.getDepartureBoard).to.be.calledWithExactly('BLAH')
        expect(responseSender.error).to.be.calledWithExactly('get', req, res, err)
        expect(next.callCount).to.be.equal(1)
      })
    })
    describe('_getWithDestination', () => {
      it('should respond with a response for a valid request to the method', async () => {
        let expectedResult = require('./exampleData/departureBoardWithDetails')
        rail.getDepartureBoard.resolves(expectedResult)
        let req = {
          params: {
            crsCode: 'GNW',
            destination: 'CST'
          }
        }
        await serviceRailRouter._getWithDestination(req, res, next)
        expect(rail.getDepartureBoard).to.be.calledWithExactly('GNW', {
          destination: req.params.destination
        })
        expect(responseSender.success).to.be.calledWithExactly('getWithDestination', req, res, expectedResult)
        expect(next.callCount).to.be.equal(1)
      })
      it('should respond with 500 error when exception occurs', async () => {
        let err = {
          error: true
        }
        rail.getDepartureBoard.rejects(err)
        let req = {
          params: {
            crsCode: 'BLAH',
            destination: 'CST'
          }
        }
        await serviceRailRouter._getWithDestination(req, res, next)
        expect(rail.getDepartureBoard).to.be.calledWithExactly('BLAH', {
          destination: req.params.destination
        })
        expect(responseSender.error).to.be.calledWithExactly('getWithDestination', req, res, err)
        expect(next.callCount).to.be.equal(1)
      })
    })
  })
})
