
class ConfigHelper {
  constructor (awsHelper) {
    this._awsHelper = awsHelper
    this._cache = new Map()
  }
  async get (name) {
    if (this._cache.has(name)) {
      return this._cache.get(name)
    } else {
      let value = process.env[name]
      if (typeof value === 'undefined') {
        value = await this._awsHelper.getParameter(name)
      }
      this._cache.set(name, value)
      return value
    }
  }
}

module.exports = ConfigHelper
