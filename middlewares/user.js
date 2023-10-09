const mongoose = require('mongoose')
const passwordResetToken = require('../models/passwordResetToken')
exports.isvalidResetToken = async (req, res, next) => {
  const { token, userId } = req.body

  if (!token || !userId) {
    return res.status(401).json({ error: 'Unauthorized,Request is not valid' })
  }

  // Check if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ error: 'Invalid user' })
  }

  try {
    const resetToken = await passwordResetToken.findOne({ owner: userId })

    if (!resetToken) {
      return res.status(401).json({ error: 'Invalid Token' })
    }

    const isMatched = await resetToken.compareToken(token)

    if (!isMatched) {
      return res
        .status(401)
        .json({ error: 'Unauthorized,Request is not valid' })
    }

    req.resetToken = resetToken
    next()
  } catch (error) {
    // This will catch any unexpected errors that aren't related to authentication
    console.error('Unexpected error during token validation:', error)

    // For any unexpected error, send an Unauthorized response to prevent app crash
    return res.status(401).json({ error: 'Unauthorized,Request is not valid' })
  }
}
