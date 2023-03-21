require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// Express server
const app = express()
const port = 3001
app.use(cors())
app.use(express.json())


// DB connection
mongoose.connect(process.env.mongoURI)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))

// Route controllers
const relicsRouter = require('./routes/relics')
app.use('/relics', relicsRouter)
const userRouter = require('./routes/users')
app.use('/users', userRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}.`)
})
