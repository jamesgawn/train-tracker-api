const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const expect = require('chai').expect
const AWSHeper = require('../../helpers/aws-helper')

describe('AWSHelper', () => {
  let awsHelper
  let ssm

  beforeEach(() => {
    awsHelper = new AWSHeper()
    ssm = {
    }
  })

  describe('constructor', () => {
    it('should initialise necessary AWS SDK modules', () => {
      expect(awsHelper._ssm).to.not.equal(undefined)
    })
  })

  describe('getParameter', () => {
    it('should retrieve for valid parameter', async () => {
      awsHelper._ssm = ssm
      let expectedResult = {
        Parameters: [
          {
            Value: 'pies'
          }
        ]
      }
      ssm.getParameters = sinon.fake.yields(null, expectedResult)
      let result = await awsHelper.getParameter('test')
      expect(result).to.be.equal('pies')
    })
    it('should reject when error occurs', async () => {
      awsHelper._ssm = ssm
      let expectedResult = {
        error: true
      }
      ssm.getParameters = sinon.fake.yields(expectedResult, null)
      try {
        await awsHelper.getParameter('test')
      } catch (err) {
        expect(err).to.deep.equal(expectedResult)
      }
    })
  })
})
