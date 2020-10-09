const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const expect = require('chai').expect
const ResponseSender = require('../../helpers/response-sender')

describe('ResponseSender', () => {
  let res
  let req
  let log
  let responseSender

  beforeEach(() => {
    req = {
      request: true
    }
    res = {
      json: sinon.fake(),
      status: sinon.fake()
    }
    log = {
      info: sinon.fake(),
      error: sinon.fake()
    }
    responseSender = new ResponseSender(log)
  })

  describe('constructor', () => {
    it('should store logger', () => {
      expect(responseSender._log).to.deep.equal(log)
    })
  })

  describe('notFound', () => {
    it('should create not found json for response', () => {
      responseSender.notFound('test', req, res, 'Unable to find X')
      expect(res.status).to.be.calledWithExactly(404)
      expect(res.json).to.be.calledWithExactly({
        status: 404,
        message: 'Unable to find X'
      })
      expect(log.info).to.be.calledWithExactly({
        req: req,
        res: res,
        method: 'test'
      }, 'Unable to find X')
    })
  })
  describe('success', () => {
    it('should create not found json for response', () => {
      responseSender.success('test', req, res, 'blob of stuff')
      expect(res.status).to.be.calledWithExactly(200)
      expect(res.json).to.be.calledWithExactly({
        status: 200,
        data: 'blob of stuff'
      })
      expect(log.info).to.be.calledWithExactly({
        req: req,
        res: res,
        method: 'test'
      })
    })
  })
  describe('error', () => {
    it('should return internal server error without exception if no DEV env variable has been set', () => {
      responseSender.error('test', req, res, 'AAARRRGGGHHH')
      expect(res.status).to.be.calledWithExactly(500)
      expect(res.json).to.be.calledWithExactly({
        status: 500,
        message: 'An internal error has occurred.'
      })
      expect(log.error).to.be.calledWithExactly({
        req: req,
        res: res,
        method: 'test',
        err: 'AAARRRGGGHHH'
      })
    })
    it('should return internal server error with exception if DEV env variable has been set', () => {
      process.env.ENV = 'DEV'
      responseSender.error('test', req, res, 'AAARRRGGGHHH')
      expect(res.status).to.be.calledWithExactly(500)
      expect(res.json).to.be.calledWithExactly({
        status: 500,
        message: 'An internal error has occurred.',
        error: 'AAARRRGGGHHH'
      })
      expect(log.error).to.be.calledWithExactly({
        req: req,
        res: res,
        method: 'test',
        err: 'AAARRRGGGHHH'
      })
      delete process.env.ENV
    })
  })
})
