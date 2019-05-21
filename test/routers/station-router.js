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
  let next, res
  let responseSender
  let stationRouter

  beforeEach(() => {
    router = {
      blah: true,
      get: sinon.fake(),
      use: sinon.fake()
    }
    next = sinon.spy()
    res = {}
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

      expect(router.get).to.be.calledWith('/')
      expect(router.get.firstCall.args[1].name).to.equal('bound _getAll')
      expect(router.get).to.be.calledWith('/:crsCode')
      expect(router.get.secondCall.args[1].name).to.equal('bound _getStation')
    })
  })

  describe('_all', () => {
    let req
    beforeEach(() => {
      req = {}
      stationRouter._cache = {
        get: sinon.spy(),
        set: sinon.spy()
      }
    })
    it('should respond with full list of stations by calling NRDP service when cache is empty', async () => {
      let expectedResult = [{
        pies: true
      }]
      railData.getStations = sinon.stub().resolves(expectedResult)
      stationRouter._cache.get = sinon.stub().returns(undefined)
      stationRouter._cache.set = sinon.spy()
      await stationRouter._getAll(req, res, next)
      expect(stationRouter._cache.set).to.be.calledWithExactly('stations', expectedResult, 60 * 60 * 24)
      expect(railData.getStations.callCount).to.equal(1)
      expect(responseSender.success).to.be.calledWithExactly('getAll', req, res, expectedResult)
      expect(next.callCount).to.equal(1)
    })
    it('should respond with full list of stations by returning cached version if available', async () => {
      let expectedResult = [{
        pies: true
      }]
      stationRouter._cache.get = sinon.stub().returns(expectedResult)
      await stationRouter._getAll(req, res, next)
      expect(railData.getStations.callCount).to.equal(0)
      expect(responseSender.success).to.be.calledWithExactly('getAll', req, res, expectedResult)
      expect(next.callCount).to.equal(1)
    })
    it('should respond with 500 error when exception occurs', async () => {
      let err = {
        error: true
      }
      railData.getStations = sinon.stub().rejects(err)
      await stationRouter._getAll(req, res, next)
      expect(railData.getStations.callCount).to.equal(1)
      expect(responseSender.error).to.be.calledWithExactly('getAll', req, res, err)
      expect(next.callCount).to.be.equal(1)
    })
  })

  describe('_getStation', () => {
    it('should respond with station details for valid station', async () => {
      let expectedResult = [{
        pies: true
      }]
      let req = {
        params: {
          crsCode: 'GNW'
        }
      }
      rail.getStationDetails = sinon.stub().resolves(expectedResult)
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
      await stationRouter._getStation(req, res, next)
      expect(rail.getStationDetails).to.be.calledWithExactly('BLAH')
      expect(responseSender.error).to.be.calledWithExactly('getStation', req, res, err)
      expect(next.callCount).to.be.equal(1)
    })
  })
})
