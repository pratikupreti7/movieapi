const nodemailer = require('nodemailer')

exports.generateOTP = (length = 6) => {
  let otp = ''

  for (let i = 1; i <= length; i++) {
    otp += Math.floor(Math.random() * 9)
  }
  return otp
}

exports.mailTransporterGeneration = () => {
  return nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'd6893ae8322261',
      pass: '5a91244524d74d',
    },
  })
}
