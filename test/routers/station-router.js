const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const expect = require('chai').expect
const StationRouter = require('../../routers/station-router')

describe('StationRouter', () => {
  let router
  let railData
  let rail
  let parentLog
  let log
  let responseSender
  let stationRouter

  beforeEach(() => {
    router = {
      blah: true,
      get: sinon.fake(),
      use: sinon.fake()
    }
    railData = {
      getStations: sinon.fake()
    }
    rail = {
      getStationDetails: sinon.fake()
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
    stationRouter = new StationRouter(router, parentLog, rail, railData)
    stationRouter._responseSender = responseSender
  })

  describe('constructor', () => {
    it('should setup availabe URIs and map to internal methods to handle response', () => {
      expect(stationRouter._railData).to.deep.equal(railData)
      expect(stationRouter._rail).to.deep.equal(rail)
      expect(stationRouter.router).to.deep.equal(router)
      expect(parentLog.child).to.be.calledWithExactly({
        module: 'station-router'
      })
      expect(stationRouter._log).to.deep.equal(log)

      expect(router.get).to.be.calledWith('/:crsCode')
      expect(router.get.firstCall.args[1].name).to.equal('bound _getStation')
    })
  })

  describe('_getStation', () => {
    it('should respond with station details for valid station', async () => {
      let expectedResult = [{
        pies: true
      }]
      rail.getStationDetails = sinon.stub().resolves(expectedResult)
      let req = {
        params: {
          crsCode: 'GNW'
        }
      }
      let res = {}
      let next = sinon.spy()
      await stationRouter._getStation(req, res, next)
      expect(rail.getStationDetails).to.be.calledWithExactly('GNW')
      expect(responseSender.success).to.be.calledWithExactly('getStation', req, res, expectedResult)
      expect(next.callCount).to.be.equal(1)
    })
    it('should respond with 404 error for invalid station', async () => {
      rail.getStationDetails = sinon.stub().resolves([])
      let req = {
        params: {
          crsCode: 'BLAH'
        }
      }
      let res = {}
      let next = sinon.spy()
      await stationRouter._getStation(req, res, next)
      expect(rail.getStationDetails).to.be.calledWithExactly('BLAH')
      expect(responseSender.notFound).to.be.calledWithExactly('getStation', req, res, 'Unable to find station BLAH')
      expect(next.callCount).to.be.equal(1)
    })
    it('should respond with 500 error when exception occurs', async () => {
      let err = {
        error: true
      }
      rail.getStationDetails = sinon.stub().rejects(err)
      let req = {
        params: {
          crsCode: 'BLAH'
        }
      }
      let res = {}
      let next = sinon.spy()
      await stationRouter._getStation(req, res, next)
      expect(rail.getStationDetails).to.be.calledWithExactly('BLAH')
      expect(responseSender.error).to.be.calledWithExactly('getStation', req, res, err)
      expect(next.callCount).to.be.equal(1)
    })
  })
})
