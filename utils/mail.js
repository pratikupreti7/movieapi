const nodemailer = require('nodemailer')
require('dotenv').config()
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
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASSWORD,
    },
  })
}
