const bloglistRouter = require('express').Router()
const Blog = require('../models/blog.js')


// bloglistRouter.get('/', (req, res) => {
//   Blog.find({})
//     .then((blogs) => {
//       res.json(blogs.map(blog => blog.toJSON()))
//     })
// })

bloglistRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs.map(blog => blog.toJSON()))
})

bloglistRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)

  const saved = await blog.save()
  res.status(201).json(saved.toJSON())
})


module.exports = bloglistRouter