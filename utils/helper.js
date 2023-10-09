const crypto = require('crypto')

exports.sendError = (res, error, statusCode = 401) => {
  return res.status(statusCode).json({
    error,
  })
}

exports.generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buf) => {
      if (err) {
        reject(err)
      }
      const bufferString = buf.toString('hex')
      resolve(bufferString)
    })
  })
}

// to be continued...
