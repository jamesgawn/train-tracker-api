class ConfigHelper {
  constructor (log) {
    this._log = log.child({ module: 'config-helper' })
    this._cache = new Map()
  }

  get (name) {
    if (this._cache.has(name)) {
      this._log.info('Retrieved ' + name + ' from Cache')
      return this._cache.get(name)
    } else {
      let value = process.env[name]
      if (typeof value === 'undefined') {
        let err = new Error('Failed to retrieve ' + name + ' from ENV Vars')
        this._log.error({
          err: err
        }, 'Failed to retrieve ' + name + ' from ENV Vars')
        throw err
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
