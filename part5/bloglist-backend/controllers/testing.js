const router = require('express').Router()
const User = require('../models/user.js')
const Blog = require('../models/blog.js')

router.post('/reset', async (req, res) => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  res.status(204).end()
})

module.exports = router