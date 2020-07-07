const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const helper = require('./test_helper.js')
const Blog = require('../models/blog.js')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({}) // initialize with empty db
  for (let blog of helper.initialBlog) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})


describe('API TESTS', () => {
  // 4.8
  test('blog posts are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  // 4.9
  test('unique identifier is id, not _id', async () => {
    const response = await api.get('/api/blogs')
    const blogArray = response.body
    blogArray.forEach(blog => {
      // console.log(blog)
      expect(blog.id).toBeDefined()
    })

  })

  // 4.10
  test('making an HTTP POST request successfully creates a new blog post', async () => {
    const newPost = {
      title: 'PRESENT DAY PRESENT TIME',
      author: 'lain',
      url: 'http://www.google.com',
      likes: 13
    }

    await api.post('/api/blogs')
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlog.length + 1)

    const blogTitles = response.body.map(r => r.title)
    expect(blogTitles).toContain('PRESENT DAY PRESENT TIME')

  })

  // 4.11
  test('check if likes property is defined and defaults to zero if not given', async () => {
    const newPost = {
      title: 'UNDEFINED LIKES SHOULD BE ZERO',
      author: 'lain',
      url: 'http://www.google.com'
    }
    await api.post('/api/blogs')
      .send(newPost)

    const blogs = await Blog.find({})
    const blogwithAdded = blogs.map(blog => blog.toJSON())
    // console.log(blogwithAdded)
    // console.log(blogwithAdded[blogwithAdded.length - 1])
    expect(blogwithAdded[blogwithAdded.length - 1].likes).toBeDefined()
  })
})




afterAll(() => {
  mongoose.connection.close()
})