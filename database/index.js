const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/movieapp'

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
