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
  let res
  let next

  beforeEach(() => {
    router = {
      blah: true,
      get: sinon.fake(),
      use: sinon.fake()
    }
    rail = { }
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

      expect(router.get).to.be.calledWith('/:crsCode')
      expect(router.get.firstCall.args[1].name).to.equal('bound _getDepartureBoard')
      expect(router.get).to.be.calledWith('/:crsCode/:destination')
      expect(router.get.secondCall.args[1].name).to.equal('bound _getDepartureBoardWithDestination')
    })
  })
  describe('methods', () => {
    describe('_getDepartureBoard', () => {
      it('should respond with station details for valid station', async () => {
        let expectedResult = require('./exampleData/departureBoardWithDetails')
        rail.getDepartureBoard = sinon.stub().resolves(expectedResult)
        let req = {
          params: {
            crsCode: 'GNW'
          }
        }
        await departureBoardRouter._getDepartureBoard(req, res, next)
        expect(rail.getDepartureBoard).to.be.calledWithExactly('GNW')
        expect(responseSender.success).to.be.calledWithExactly('getDepartureBoard', req, res, expectedResult)
        expect(next.callCount).to.be.equal(1)
      })
      it('should respond with 500 error when exception occurs', async () => {
        let err = {
          error: true
        }
        rail.getDepartureBoard = sinon.stub().rejects(err)
        let req = {
          params: {
            crsCode: 'BLAH'
          }
        }
        await departureBoardRouter._getDepartureBoard(req, res, next)
        expect(rail.getDepartureBoard).to.be.calledWithExactly('BLAH')
        expect(responseSender.error).to.be.calledWithExactly('getDepartureBoard', req, res, err)
        expect(next.callCount).to.be.equal(1)
      })
    })
    describe('_getDepartureBoardWithDestination', () => {
      it('should respond with station details for valid station', async () => {
        let expectedResult = require('./exampleData/departureBoardWithDetails')
        rail.getDepartureBoard = sinon.stub().resolves(expectedResult)
        let req = {
          params: {
            crsCode: 'GNW',
            destination: 'CST'
          }
        }
        await departureBoardRouter._getDepartureBoardWithDestination(req, res, next)
        expect(rail.getDepartureBoard).to.be.calledWithExactly('GNW', {
          destination: req.params.destination
        })
        expect(responseSender.success).to.be.calledWithExactly('getDepartureBoardWithDestination', req, res, expectedResult)
        expect(next.callCount).to.be.equal(1)
      })
      it('should respond with 500 error when exception occurs', async () => {
        let err = {
          error: true
        }
        rail.getDepartureBoard = sinon.stub().rejects(err)
        let req = {
          params: {
            crsCode: 'BLAH',
            destination: 'CST'
          }
        }
        await departureBoardRouter._getDepartureBoardWithDestination(req, res, next)
        expect(rail.getDepartureBoard).to.be.calledWithExactly('BLAH', {
          destination: req.params.destination
        })
        expect(responseSender.error).to.be.calledWithExactly('getDepartureBoardWithDestination', req, res, err)
        expect(next.callCount).to.be.equal(1)
      })
    })
  })
})
