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


// 4.8
test('blog posts are returned as json', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

//4.9
test('unique identifier is id, not _id', async () => {
  const response = await api.get('/api/blogs')
  const blogArray = response.body
  blogArray.forEach(blog => {
    // console.log(blog)
    expect(blog.id).toBeDefined()
  })

})


afterAll(() => {
  mongoose.connection.close()
})