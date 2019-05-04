const { describe, it } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const expect = require('chai').expect
const LogBuilder = require('../../helpers/log-builder')

describe('LogHelper', () => {
  describe('wrap', () => {
    it('should wrap detail of log message in container', () => {
      let message = 'more pies'
      let detail = {
        blah: true
      }
      expect(LogBuilder.wrap(message, detail)).to.deep.equal({
        msg: message,
        detail: detail
      })
    })
  })
  describe('wrapRequestWithMessage', () => {
    it('should wrap detail of log message including req detaills', () => {
      let message = 'more pies'
      let detail = {
        baseUrl: 'baseUrl',
        headers: 'headers',
        method: 'method',
        httpVersion: 'httpVersion',
        originalUrl: 'originalUrl',
        params: 'params',
        query: 'query',
        url: 'url',
        dross: true
      }
      expect(LogBuilder.wrapRequestWithMessage(message, detail)).to.deep.equal({
        msg: message,
        detail: {
          req: {
            baseUrl: 'baseUrl',
            headers: 'headers',
            method: 'method',
            httpVersion: 'httpVersion',
            originalUrl: 'originalUrl',
            params: 'params',
            query: 'query',
            url: 'url'
          }
        }
      })
    })
  })
  describe('wrapRequest', () => {
    it('should wrap detail of log message including req detaills', () => {
      let detail = {
        baseUrl: 'baseUrl',
        headers: 'headers',
        method: 'method',
        httpVersion: 'httpVersion',
        originalUrl: 'originalUrl',
        params: 'params',
        query: 'query',
        url: 'url',
        dross: true
      }
      expect(LogBuilder.wrapRequest(detail)).to.deep.equal({
        detail: {
          req: {
            baseUrl: 'baseUrl',
            headers: 'headers',
            method: 'method',
            httpVersion: 'httpVersion',
            originalUrl: 'originalUrl',
            params: 'params',
            query: 'query',
            url: 'url'
          }
        }
      })
    })
  })
  describe('wrapRequestError', () => {
    it('should wrap detail of log message including req detaills', () => {
      let req = {
        baseUrl: 'baseUrl'
      }
      let err = {
        error: true
      }
      let msg = 'AARRGH'
      expect(LogBuilder.wrapRequestError(msg, req, err)).to.deep.equal({
        detail: {
          req: req,
          err: err
        },
        msg: msg
      })
    })
  })
})
