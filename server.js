require('dotenv').config()
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const cors = require('cors')

const app = express()
const port = 3001
app.use(cors())
// app.use(express.json())

const relics = require('./controllers/relics')
const inventory = require('./controllers/inventory')

const client = new MongoClient(process.env.mongoURI)
const dbRelics = client.db('relictrackerapi').collection('relicdata')
const dbInventory = client.db('relictrackerapi').collection('inventorydata')

app.get('/', (req, res) => {
  res.send('yo')
  console.log('yo')
})

app.get('/index-relics', async (req, res) => {
  console.log('/index-relics')
  res.send(relics.getRelics(req, res, dbRelics))
})

app.get('/index-inventory', async (req, res) => {
  console.log('/index-inventory')
  inventory.getInventory(req, res, dbInventory)
})

app.get('/relics', async (req, res) => { relics.getRelics(req, res, dbRelics) })

app.get('/inventory', async (req, res) => { inventory.getInventory(req, res, dbInventory) })

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
