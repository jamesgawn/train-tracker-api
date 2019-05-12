const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const expect = require('chai').expect
const ConfigHelper = require('../../helpers/config-helper')

describe('ConfigHelper', () => {
  let configHelper
  let parentLog
  let log

  beforeEach(() => {
    log = {
      info: sinon.spy(),
      error: sinon.spy()
    }
    parentLog = {
      child: sinon.fake.returns(log)
    }
    configHelper = new ConfigHelper(parentLog)
  })

  describe('constructor', () => {
    it('should store aws helper', () => {
      expect(configHelper._cache).to.deep.equal(new Map())
      expect(configHelper._log).to.deep.equal(log)
      expect(parentLog.child).to.be.calledWithExactly({
        module: 'config-helper'
      })
    })
  })

  describe('methods', () => {
    let varName
    let varValue

    beforeEach(() => {
      varName = '/blah/test'
      varValue = 'pies'
      configHelper._cache = {
        set: sinon.spy()
      }
    })

    describe('get', () => {
      it('should return config from cache when available', () => {
        configHelper._cache.get = sinon.fake.returns(varValue)
        configHelper._cache.has = sinon.fake.returns(true)
        let result = configHelper.get(varName)
        expect(result).to.equal(varValue)
        expect(configHelper._cache.has).to.be.calledWithExactly(varName)
        expect(configHelper._cache.get).to.be.calledWithExactly(varName)
        expect(configHelper._log.info).to.be.calledWithExactly('Retrieved ' + varName + ' from Cache')
        delete process.env[varName]
      })
      it('should return config from env var when available', () => {
        configHelper._cache.has = sinon.fake.returns(false)
        process.env[varName] = varValue
        let result = configHelper.get(varName)
        expect(result).to.equal(varValue)
        expect(configHelper._cache.has).to.be.calledWithExactly(varName)
        expect(configHelper._cache.set).to.be.calledWithExactly(varName, varValue)
        expect(configHelper._log.info).to.be.calledWithExactly('Retrieved ' + varName + ' from ENV Vars')
        expect(configHelper._log.info).to.be.calledWithExactly('Saved ' + varName + ' in Cache')
        delete process.env[varName]
      })
      it('should throw error when variable isn`t in envVars and fail on error is not set', async () => {
        configHelper._cache.has = sinon.fake.returns(false)
        let expectedError = new Error('Failed to retrieve ' + varName + ' from ENV Vars')
        let resultError
        try {
          configHelper.get(varName)
        } catch (err) {
          resultError = err
        }
        expect(configHelper._log.error.args[0][1]).to.equal('Failed to retrieve ' + varName + ' from ENV Vars')
        expect(configHelper._cache.has).to.be.calledWithExactly(varName)
        expect(resultError.message).to.be.equal(expectedError.message)
      })
      it('should throw error when variable isn`t in envVars and fail on error is true', async () => {
        configHelper._cache.has = sinon.fake.returns(false)
        let expectedError = new Error('Failed to retrieve ' + varName + ' from ENV Vars')
        let resultError
        try {
          configHelper.get(varName, true)
        } catch (err) {
          resultError = err
        }
        expect(configHelper._log.error.args[0][1]).to.equal('Failed to retrieve ' + varName + ' from ENV Vars')
        expect(configHelper._cache.has).to.be.calledWithExactly(varName)
        expect(resultError.message).to.be.equal(expectedError.message)
      })
      it('should return null when fail on error is fales and env var is not available', () => {
        configHelper._cache.has = sinon.fake.returns(false)
        let result = configHelper.get(varName, false)
        expect(result).to.equal(null)
        expect(configHelper._cache.has).to.be.calledWithExactly(varName)
        expect(configHelper._log.info).to.be.calledWithExactly('Retrieved ' + varName + ' from ENV Vars, but it was unavailable')
      })
    })
  })
})
