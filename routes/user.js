const express = require('express')
const {
  createUser,
  emailVerify,
  resendEmailVerification,
  forgotPassword,
  sendResetPasswordTokenStatus,
  resetPassword,
  signin,
} = require('../controllers/user')

const {
  useValidator,
  validateSignIn,
  validate,
  validatePassword,
} = require('../middlewares/validators')
const { isvalidResetToken } = require('../middlewares/user')
const { reset } = require('nodemon')
const { sign } = require('jsonwebtoken')
const router = express.Router()

router.get('/', (req, res) => {
  // '/' is the root path
  res.send('<h1>Hello World from user Route</h1>')
})

router.post('/create', useValidator, validate, createUser)

router.post('/verifyemail', emailVerify)
router.post('/resendemailtoken', resendEmailVerification)
router.post('/forgotpassword', forgotPassword)
router.post('/passwordreset', isvalidResetToken, sendResetPasswordTokenStatus)

router.post(
  '/resetpassword',
  validatePassword,
  validate,
  isvalidResetToken,
  resetPassword,
)
router.post('/signin', validateSignIn, validate, signin)

module.exports = router
