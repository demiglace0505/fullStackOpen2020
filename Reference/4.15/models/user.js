const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  name: String,
  passwordHash : {
    type: String,
  }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)