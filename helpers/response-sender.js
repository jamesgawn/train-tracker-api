class ResponseSender {
  static notFound (res, message) {
    res.status(404)
    res.json({
      status: 404,
      message: message
    })
  }
  static error (res, error) {
    let response = {
      status: 500,
      message: 'An internal error has occurred.'
    }

    if (process.env['ENV'] === 'DEV') {
      response.error = error
    }
    res.status(500)
    res.json(response)
  }
  static success (res, data) {
    res.status(200)
    res.json({
      status: 200,
      data: data
    })
  }
}

module.exports = ResponseSender
