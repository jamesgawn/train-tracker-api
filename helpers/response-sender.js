class ResponseSender {
  constructor (log) {
    this._log = log
  }

  notFound (method, req, res, msg) {
    res.status(404)
    res.json({
      status: 404,
      message: msg
    })
    this._log.info({
      req: req,
      res: res,
      method: method
    }, msg)
  }

  error (method, req, res, err) {
    const response = {
      status: 500,
      message: 'An internal error has occurred.'
    }

    if (process.env.ENV === 'DEV') {
      response.error = err
    }
    res.status(500)
    res.json(response)
    this._log.error({
      req: req,
      res: res,
      method: method,
      err: err
    })
  }

  success (method, req, res, content) {
    res.status(200)
    res.json({
      status: 200,
      data: content
    })
    this._log.info({
      req: req,
      res: res,
      method: method
    })
  }
}

module.exports = ResponseSender
