const express = require('express')
const router = express.Router()
const User = require('../models/user')

// API endpoints
// http://localhost:3001/users/

// Get user data
//      UNUSED
router.get('/:userid', getUserExists, async (req, res) => {
  console.log('>> GET   ', req.params.userid)
  try {
    const userData = res.user
    res.status(200).json(userData)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get one relic inventory
router.get('/:userid/:id', getUserExists, getInventoryExists, async (req, res) => {
  console.log('>> GET   ', req.params.userid, req.params.id)
  try {
    const thisInventory = res.user.inventory.filter((item) => item.id === req.params.id)[0]
    res.status(200).json(thisInventory)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update existing relic data
router.patch('/:userid/update/:id', getUserExists, getInventoryExists, async (req, res) => {
  const { inventory } = res.user
  const { sessionDrops, bestStreak } = req.body
  const { userid, id } = req.params
  console.log('\n>> PATCH ', userid, id, '\n')
  const thisRelic = inventory.filter((item) => item.id === id)[0]
  const thisIndex = inventory.indexOf(thisRelic)
  console.log('Old data: ', thisRelic.data)
  console.log('  Update: ', sessionDrops)
  
  try {
    for (let i = 0; i < 6; i++) {
      thisRelic.data[i] += sessionDrops[i]
    }
    if (bestStreak > thisRelic.best) {
      thisRelic.best = bestStreak
    }
    inventory.splice(thisIndex, 1, thisRelic)
    await User.findOneAndUpdate(
      { uid: userid }, 
      { inventory }, 
      { returnOriginal: false })
    res.status(200).json(thisRelic)
    console.log('New data: ', thisRelic.data, '\n')
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Create new blank relic dataset
//      UNUSED
router.patch('/:userid/createrelic/:id', getUserExists, getInventoryDoesNotExist, async (req, res) => {
  const { userid, id } = req.params
  const { inventory } = res.user
  console.log('\n>> PATCH ', userid, id, '\n')
  try {
    const newRelic = { id, data: [0, 0, 0, 0, 0, 0], best: 0 }
    res.user.inventory.push(newRelic)
    await User.findOneAndUpdate(
      { uid: userid }, 
      { inventory }, 
      { returnOriginal: false })
    res.status(201).json({ message: `Created blank relic inventory for ${id}` })
    console.log(newRelic, '\n')
  } catch (err) {
    res.status(500).json({ message: err.message })
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
      return res.status(404).json({ message: `Inventory data does not exist for ${req.params.id}` })
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
      return res.status(400).json({ message: `Inventory data already exists for ${req.params.id}` })
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
