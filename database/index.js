const mongoose = require('mongoose')

const url = process.env.MONGO_DB_URI

mongoose
  .connect(`${url}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to database sucessfully`)
  })
  .catch((err) => {
    console.log(`Error connecting to database: ${err}`)
  })
