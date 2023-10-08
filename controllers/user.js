const User = require('../models/user')
const emailVerificationToken = require('../models/emailVerificationToken')
const nodemailer = require('nodemailer')
const { isValidObjectId } = require('mongoose')
const { generateOTP, mailTransporterGeneration } = require('../utils/mail')
createUser = async (req, res) => {
  // '/' is the root path

  const { name, email, password } = req.body
  const exsistingUser = await User.findOne({ email })
  if (exsistingUser) {
    return res.status(401).json({
      error: 'User already exists with this email',
    })
  }
  const user = new User({ name, email, password })
  await user.save()
  let otp = generateOTP()

  const newEmailVerificationToken = new emailVerificationToken({
    owner: user._id,
    token: otp,
  })

  await newEmailVerificationToken.save()

  var transport = mailTransporterGeneration()
  const mailOptions = {
    from: 'verification@movieapp.com',
    to: user.email,
    subject: 'Email Verification for Couch Potato',
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Welcome to MovieApp, ${user.name}!</h1>
            <p style="font-size: 16px; color: #555; margin-top: 20px;">Thank you for registering with Couch Potato. To verify your email address and complete your registration, please enter the following verification code:</p>
            <div style="background-color: #f7f7f7; padding: 15px; text-align: center; margin-top: 20px; border-radius: 5px;">
                <span style="font-size: 18px; font-weight: bold; color: #333;">${otp}</span>
            </div>
            <p style="font-size: 16px; color: #555; margin-top: 20px;">If you didn't request this verification code, please ignore this email or contact our support team.</p>
            <p style="font-size: 14px; color: #777; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 10px;">Thank you,<br>MovieApp Team</p>
        </div>
    `,
  }

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email send error:', error)
    } else {
      console.log('Email sent:', info.response)
    }
  })

  res.status(201).json({
    message:
      'Please verify your email address.OTP has been sent to your email ',
  })
}

const emailVerify = async (req, res) => {
  const { otp, userId } = req.body
  if (!isValidObjectId(userId)) {
    return res.status(401).json({
      error: 'Invalid User',
    })
  }
  const user = await User.findById(userId)
  if (!user) {
    return res.status(401).json({
      error: 'User not found',
    })
  }

  if (user.isVerified) {
    return res.status(401).json({
      error: 'User already verified',
    })
  }
  const token = await emailVerificationToken.findOne({ owner: userId })
  if (!token) {
    return res.status(401).json({
      error: 'Invalid OTP',
    })
  }

  const isMatched = await token.compareToken(otp)
  if (!isMatched) {
    return res.status(401).json({
      error: 'OTP is not valid',
    })
  }

  user.isVerified = true
  await user.save()
  await emailVerificationToken.findByIdAndDelete(token._id)

  var transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'd6893ae8322261',
      pass: '5a91244524d74d',
    },
  })
  const mailOptions = {
    from: 'verification@movieapp.com',
    to: user.email,
    subject: 'Email Verified Successfully at Couch Potato!',
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Welcome to Couch Potato, ${user.name}!</h1>
            <p style="font-size: 16px; color: #555; margin-top: 20px;">Thank you for verifying your email address. Your registration is now complete, and you can enjoy all the features of Couch Potato!</p>
            <p style="font-size: 16px; color: #555; margin-top: 20px;">If you have any questions or need assistance, please feel free to reach out to our support team. We're here to help!</p>
            <p style="font-size: 14px; color: #777; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 10px;">Best regards,<br>Couch Potato Team</p>
        </div>
    `,
  }
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email send error:', error)
    } else {
      console.log('Email sent:', info.response)
    }
  })

  res.status(200).json({
    message: 'Email verified successfully',
  })
}

const resendEmailVerification = async (req, res) => {
  const { userId } = req.body
  const user = await User.findById(userId)
  if (!user) {
    return res.status(401).json({
      error: 'User not found',
    })
  }
  if (user.isVerified) {
    return res.status(401).json({
      error: 'User already verified',
    })
  }

  const hasToken = await emailVerificationToken.findOne({ owner: userId })
  if (hasToken) {
    return res.status(401).json({
      error:
        'Please wait for atleast one hour to resend OTP.Please do check your spam folder',
    })
  }

  let otp = generateOTP()

  const newEmailVerificationToken = new emailVerificationToken({
    owner: userId,
    token: otp,
  })

  await newEmailVerificationToken.save()

  var transport = mailTransporterGeneration()

  const mailOptions = {
    from: 'verification@movieapp.com',
    to: user.email,
    subject: 'Email Verification for Couch Potato',
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Welcome to MovieApp, ${user.name}!</h1>
            <p style="font-size: 16px; color: #555; margin-top: 20px;">Thank you for registering with Couch Potato. To verify your email address and complete your registration, please enter the following verification code:</p>
            <div style="background-color: #f7f7f7; padding: 15px; text-align: center; margin-top: 20px; border-radius: 5px;">
                <span style="font-size: 18px; font-weight: bold; color: #333;">${otp}</span>
            </div>
            <p style="font-size: 16px; color: #555; margin-top: 20px;">If you didn't request this verification code, please ignore this email or contact our support team.</p>
            <p style="font-size: 14px; color: #777; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 10px;">Thank you,<br>MovieApp Team</p>
        </div>
    `,
  }

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email send error:', error)
    } else {
      console.log('Email sent:', info.response)
    }
  })

  res.status(201).json({
    message:
      'Please verify your email address.New OTP has been sent to your email ',
  })
}

module.exports = {
  createUser,
  emailVerify,
  resendEmailVerification,
}
