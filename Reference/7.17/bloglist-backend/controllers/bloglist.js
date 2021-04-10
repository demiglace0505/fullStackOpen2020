const bloglistRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../utils/config.js')
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

  // extracting token uses middleware tokenExtractor
  const decodedToken = jwt.verify(req.token, config.LOGINTOKEN)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const user = await User.findById(decodedToken.id)

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
  const decodedToken = jwt.verify(req.token, config.LOGINTOKEN)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const blog = await Blog.findById(req.params.id)
  // console.log(blog)
  // console.log(decodedToken)
  // compare user id and decoded token's id
  if (blog.user.toString() !== decodedToken.id.toString()) {
    return res.status(400).json({
      error: 'cannot delete, you are not authorized'
    })
  }
  await Blog.findByIdAndRemove(req.params.id)

  // update user's blog collection to remove deleted blog
  const user = await User.findById(decodedToken.id)
  user.blogs = user.blogs.filter(b => b.toString() !== req.params.id)
  await user.save()

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

// bloglistRouter.get('/:id/comments', async (req, res) => {
//   const comments = await Comment.find({})
//   comments.forEach(c => console.log(c))
// })

bloglistRouter.post('/:id/comments', async (req,res) => {
  const decodedToken = jwt.verify(req.token, config.LOGINTOKEN)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const blog = await Blog.findById(req.params.id)
  if (blog) {
    blog.comments = blog.comments.concat(req.body.content)
    const saved = await blog.save()
    res.status(200).json(saved.toJSON())
  } else {
    return res.status(404).json({
      error: 'blog not found'
    })
  }
})


module.exports = bloglistRouter