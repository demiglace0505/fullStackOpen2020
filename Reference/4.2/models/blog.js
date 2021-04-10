const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  Likes: Number
})

module.exports = mongoose.model('Blog', blogSchema)