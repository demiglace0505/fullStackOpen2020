const bloglistRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')


bloglistRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
     username: 1,
     name: 1,
     id: 1
  })

  res.json(blogs.map(blog => blog.toJSON()))
})

bloglistRouter.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findById(body.userId)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const saved = await blog.save()
  // add blog to user's blog collection
  user.blogs = user.blogs.concat(saved._id)
  await user.save()
  
  res.status(201).json(saved.toJSON())
})

bloglistRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

bloglistRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  res.json(updatedBlog.toJSON())
})


module.exports = bloglistRouter