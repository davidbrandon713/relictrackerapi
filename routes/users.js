const express = require('express')
const router = express.Router()
const User = require('../models/user')

// API endpoints
// http://localhost:3001/users/

// Get user data
router.get('/:userid', getUserExists, async (req, res) => {
  console.log('GET', req.params.userid)
  try {
    const userData = res.user
    res.status(200).json(userData)
  } catch (err) {
    res.status(501).json({ message: err.message })
  }
})

// Get one relic inventory
router.get('/:userid/:id', getUserExists, async (req, res) => {
  console.log('GET', req.params.userid, req.params.id)
  try {
    const thisInventory = res.user.inventory.filter((item) => item.id === req.params.id)[0]
    res.status(200).json(thisInventory)
  } catch (err) {
    res.status(504).json({ message: err.message })
  }
})

// Update existing relic data
router.patch('/:userid/update/:id', getUserExists, getInventoryExists, async (req, res) => {
  console.log('PATCH', req.params.userid, req.params.id)
  const { sessionDrops } = req.body
  const thisRelic = res.user.inventory.filter((item) => item.id === req.params.id)[0]
  const thisIndex = res.user.inventory.indexOf(thisRelic)
  console.log('Old data: ', thisRelic.data)
  console.log('New data: ', sessionDrops)
  
  try {
    for (let i = 0; i < 6; i++) {
      thisRelic.data[i] += sessionDrops[i]
    }
    res.user.inventory.splice(thisIndex, 1, thisRelic)
    await User.findOneAndUpdate(
      { uid: req.params.userid }, 
      { inventory: res.user.inventory }, 
      { returnOriginal: false })
    res.json(thisRelic)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
})

// Create new empty relic data
router.patch('/:userid/create/:id', getUserExists, getInventoryDoesNotExist, async (req, res) => {
  console.log('PATCH', req.params.userid, req.params.id)
  try {
    const newRelic = { id: req.params.id, data: [0, 0, 0, 0, 0, 0] }
    res.user.inventory.push(newRelic)
    await User.findOneAndUpdate(
      { uid: req.params.userid }, 
      { inventory: res.user.inventory }, 
      { returnOriginal: false })
    res.json({ message: 'Updated inventory' })
  } catch (err) {
    res.status(501).json({ message: err.message })
  }
})


// ##########################################################
//                        Middleware

async function getInventoryExists(req, res, next) {
  let match
  try {
    if (res.user) {
      match = res.user.inventory.filter((item) => item.id === req.params.id)[0]
    }
    if (match == undefined) {
      return res.status(401).json({ message: `Inventory data does not exist for ${req.params.id}` })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  next()
}

async function getInventoryDoesNotExist(req, res, next) {
  let match
  try {
    if (res.user) {
      match = res.user.inventory.filter((item) => item.id === req.params.id)[0]
    }
    if (match !== undefined) {
      return res.status(401).json({ message: `Inventory data already exists for ${req.params.id}` })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  next()
}

async function getUserExists(req, res, next) {
  let user
  try {
    user = await User.findOne({ uid: req.params.userid })
    if (user == null) {
      return res.status(404).json({ message: `Cannot find user ${req.params.user}` })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.user = user
  next()
}



module.exports = router;