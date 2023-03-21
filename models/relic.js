const mongoose = require('mongoose')

const RelicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  drops: {
    type: Array,
    required: true,
  },
  id: {
    type: String,
    required: true,
  }
}, {
  collection: 'relics',
  versionKey: false,
})

module.exports = mongoose.model('relics', RelicSchema)