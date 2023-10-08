const { check, validationResult } = require('express-validator')

const useValidator = [
  check('name').trim().not().isEmpty().withMessage('Name is missing'),
  check('email').normalizeEmail().isEmail().withMessage('Email is invalid'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be at least 6 characters long))'),
]
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    })
  }
  next()
}
module.exports = {
  useValidator,
  validate,
}
