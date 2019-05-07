const AWS = require('aws-sdk')

class AWSHelper {
  constructor () {
    this._ssm = new AWS.SSM()
  }

  async getParameter (parameterName) {
    return new Promise((resolve, reject) => {
      this._ssm.getParameters({
        Names: [parameterName],
        WithDecryption: true
      }, function (err, result) {
        if (err !== null) {
          reject(err)
        } else {
          resolve(result.Parameters[0].Value)
        }
      })
    })
  }
}

module.exports = AWSHelper
