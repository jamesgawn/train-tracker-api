const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const expect = require('chai').expect
const ResponseSender = require('../../helpers/response-sender')

describe('ResponseSender', () => {
  let res

  beforeEach(() => {
    res = {
      json: sinon.fake(),
      status: sinon.fake()
    }
  })

  describe('notFound', () => {
    it('should create not found json for response', () => {
      ResponseSender.notFound(res, 'Unable to find X')
      expect(res.status).to.be.calledWithExactly(404)
      expect(res.json).to.be.calledWithExactly({
        status: 404,
        message: 'Unable to find X'
      })
    })
  })
  describe('success', () => {
    it('should create not found json for response', () => {
      ResponseSender.success(res, 'blob of stuff')
      expect(res.status).to.be.calledWithExactly(200)
      expect(res.json).to.be.calledWithExactly({
        status: 200,
        data: 'blob of stuff'
      })
    })
  })
  describe('error', () => {
    it('should return internal server error without exception if no DEV env variable has been set', () => {
      ResponseSender.error(res, 'AAARRRGGGHHH')
      expect(res.status).to.be.calledWithExactly(500)
      expect(res.json).to.be.calledWithExactly({
        status: 500,
        message: 'An internal error has occurred.'
      })
    })
    it('should return internal server error with exception if DEV env variable has been set', () => {
      process.env['ENV'] = 'DEV'
      ResponseSender.error(res, 'AAARRRGGGHHH')
      expect(res.status).to.be.calledWithExactly(500)
      expect(res.json).to.be.calledWithExactly({
        status: 500,
        message: 'An internal error has occurred.',
        error: 'AAARRRGGGHHH'
      })
      delete process.env['ENV']
    })
  })
})
