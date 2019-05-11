const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const expect = require('chai').expect
const ConfigHelper = require('../../helpers/config-helper')

describe('ConfigHelper', () => {
  let configHelper
  let awsHelper

  beforeEach(() => {
    awsHelper = {
    }
    configHelper = new ConfigHelper(awsHelper)
  })

  describe('constructor', () => {
    it('should store aws helper', () => {
      expect(configHelper._awsHelper).to.deep.equal(awsHelper)
      expect(configHelper._cache).to.deep.equal(new Map())
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
      it('should return config from cache when available', async () => {
        configHelper._cache.get = sinon.fake.returns(varValue)
        configHelper._cache.has = sinon.fake.returns(true)
        let result = await configHelper.get(varName)
        expect(result).to.equal(varValue)
        expect(configHelper._cache.has).to.be.calledWithExactly(varName)
        expect(configHelper._cache.get).to.be.calledWithExactly(varName)
        delete process.env[varName]
      })
      it('should return config from env var when available', async () => {
        configHelper._cache.has = sinon.fake.returns(false)
        process.env[varName] = varValue
        let result = await configHelper.get(varName)
        expect(result).to.equal(varValue)
        expect(configHelper._cache.has).to.be.calledWithExactly(varName)
        expect(configHelper._cache.set).to.be.calledWithExactly(varName, varValue)
        delete process.env[varName]
      })
      it('should return config from aws param store when available', async () => {
        configHelper._cache.has = sinon.fake.returns(false)
        awsHelper.getParameter = sinon.fake.resolves(varValue)
        let result = await configHelper.get(varName)
        expect(awsHelper.getParameter).to.be.calledWithExactly(varName)
        expect(configHelper._cache.has).to.be.calledWithExactly(varName)
        expect(configHelper._cache.set).to.be.calledWithExactly(varName, varValue)
        expect(result).to.equal(varValue)
      })
      it('should throw error when variable isn`t in envVars or error returned from aws param store', async () => {
        configHelper._cache.has = sinon.fake.returns(false)
        let expectedError = new Error(varName + ' not present in ENV vars')
        let resultError
        awsHelper.getParameter = sinon.fake.rejects(expectedError)
        try {
          await configHelper.get(varName)
        } catch (err) {
          resultError = err
        }
        expect(configHelper._cache.has).to.be.calledWithExactly(varName)
        expect(resultError).to.be.equal(expectedError)
      })
    })
  })
})
