
class ConfigHelper {
  constructor (log, awsHelper) {
    this._awsHelper = awsHelper
    this._log = log.child({ module: 'config-helper' })
    this._cache = new Map()
  }
  async get (name) {
    if (this._cache.has(name)) {
      this._log.info('Retrieved ' + name + ' from Cache')
      return this._cache.get(name)
    } else {
      let value = process.env[name]
      if (typeof value === 'undefined') {
        try {
          value = await this._awsHelper.getParameter(name)
        } catch (err) {
          this._log.error({
            err: err
          }, 'Failed to retrieve ' + name + ' from AWS Parameter Store')
          throw err
        }
        this._log.info('Retrieved ' + name + ' from AWS Parameter Store')
      } else {
        this._log.info('Retrieved ' + name + ' from ENV Vars')
      }
      this._cache.set(name, value)
      this._log.info('Saved ' + name + ' in Cache')
      return value
    }
  }
}

module.exports = ConfigHelper
