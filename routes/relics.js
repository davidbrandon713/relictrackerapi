const express = require('express')
const router = express.Router()
const Relic = require('../models/relic')

// API endpoints
// http://localhost:3001/relics/

// Get all relic data
router.get('/', async (req, res) => {
  try {
    const relics = await Relic.find().sort({name: 1})
    res.status(200).json(relics)
    console.log(`GET all relic data`)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get one relic
router.get('/:id', getRelicExists, (req, res) => {
  res.json(res.relic)
  console.log(`GET ${res.relic.name} droplist`)
})

// Create a relic
router.post('/', getRelicNonexistant, async (req, res) => {
  let relic
  if (req.body.name && req.body.drops && req.body.id) {
    relic = new Relic({
      name: req.body.name,
      drops: req.body.drops,
      id: req.body.id,
    })
    try {
      const newRelic = await relic.save()
      res.status(201).json(newRelic)
      console.log(`POST ${newRelic.name}`)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  } else {res.status(204).json({ message: 'Missing required data'})}
})

// Modify one relic
router.patch('/:id', async (req, res) => {
  
})

// Delete one relic
router.delete('/:id', getRelicExists, async (req, res) => {
  try {
    await Relic.deleteOne({ id: res.relic.id })
    res.status(200).json({ message: `Deleted ${res.relic.name}`})
    console.log(`DELETE ${res.relic.name}`)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})




// Middleware

async function getRelicExists(req, res, next) {
  let relic
  try {
    relic = await Relic.findOne({ id: req.params.id })
    if (relic == null) {
      return res.status(404).json({ message: `Cannot find ${req.params.id}` })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.relic = relic
  next()
}

async function getRelicNonexistant(req, res, next) {
  let relic
  try {
    relic = await Relic.findOne({ id: req.body.id })
    if (relic !== null) {
      return res.status(400).json({ message: `${req.body.name} already exists` })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  
  next()
}


module.exports = router;
