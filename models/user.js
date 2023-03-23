const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  inventory: [{
    id: {
      type: String,
      required: true,
    },
    data: [{
      type: Number,
      required: true,
    }],
    best: {
      type: Number,
      required: true,
    }
  }],
}, {
  collection: 'users',
  versionKey: false,
})

module.exports = mongoose.model('users', UserSchema)