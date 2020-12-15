const bloglistRouter = require('express').Router()
const Blog = require('../models/blog.js')


bloglistRouter.get('/', (req, res) => {
  Blog.find({})
    .then((blogs) => {
      res.json(blogs.map(blog => blog.toJSON()))
    })
})

bloglistRouter.post('/', (req, res) => {
  const blog = new Blog(req.body)

  blog.save()
    .then((result) => {
      res.status(201).json(result)
    })
})


module.exports = bloglistRouter