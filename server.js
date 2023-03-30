require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const welcome = require('./welcome')

// Express server
const app = express()
const port = 8080
app.use(express.json())
app.use(cors())

// DB connection
mongoose.connect(process.env.mongoURI)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('\x1b[33mConnected to database\x1b[39m'))

// Route controllers
const relicsRouter = require('./routes/relics')
app.use('/relics', relicsRouter)
const userRouter = require('./routes/users')
app.use('/users', userRouter)

app.listen(port, () => {
  console.log(welcome.drawTree())
  console.log(`\x1b[33mServer running on port ${port}.\x1b[39m`)
})
