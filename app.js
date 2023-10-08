// Define
const express = require('express')
const userRouter = require('./routes/user')
require('./database')
const app = express()
app.use(express.json()) // for parsing application/json

// API endpoints
app.use('/api/user', userRouter)

// Listen to port 3000

app.listen(3000, () => {
  ;`Server is running at port 3000`
})




