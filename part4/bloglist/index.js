require('dotenv').config()

//env vars
const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  Likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to Mongo DB')
  })
  .catch((err) => {
    console.error('error connecting to MongoDB:', err.message)
  })

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Yahallo</h1>')
})

app.get('/api/blogs', (req, res) => {
  Blog.find({})
    .then((blogs) => {
      res.json(blogs)
    })
})

app.post('/api/blogs', (req, res) => {
  const blog = new Blog(req.body)

  blog.save()
    .then((result) => {
      res.status(201).json(result)
    })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})