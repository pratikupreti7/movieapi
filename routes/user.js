const express = require('express')
const {
  createUser,
  emailVerify,
  resendEmailVerification,
} = require('../controllers/user')

const { useValidator, validate } = require('../middlewares/validators')
const router = express.Router()

router.get('/', (req, res) => {
  // '/' is the root path
  res.send('<h1>Hello World from user Route</h1>')
})

router.post('/create', useValidator, validate, createUser)
router.post('/verifyemail', emailVerify)
router.post('/resendemailtoken', resendEmailVerification)

module.exports = router
