const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const helper = require('./test_helper.js')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

const api = supertest(app)

let token = ''
let badToken = ''

beforeEach(async () => {
  // initialize with empty db
  await Blog.deleteMany({})
  await User.deleteMany({})

  // create tester user
  const tester = {
    username: 'tester',
    name: 'TEST TEST TEST',
    password: 'testPass123'
  }

  await api.post('/api/users').send({
    username: tester.username,
    name: tester.name,
    password: tester.password
  })

  // create unauthorized tester
  const badTester = {
    username: 'badTester',
    name: 'BAD BAD BAD',
    password: 'badTestPass123'
  }

  await api.post('/api/users').send({
    username: badTester.username,
    name: badTester.name,
    password: badTester.password
  })

  // login the tester user
  const loggedTester = await api.post('/api/login')
    .send({
      username: tester.username,
      password: tester.password
    })
  token = loggedTester.body.token
  // console.log(token)

  //login the unauthorized tester
  const loggedbadTester = await api.post('/api/login')
    .send({
      username: badTester.username,
      password: badTester.password
    })
  badToken = loggedbadTester.body.token
  // console.log(badToken)

  // load initial Blog data
  for (let blog of helper.initialBlog) {
    let blogObject = new Blog(blog)
    // console.log(blogObject)
    await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(blogObject)
  }

  // const blogsAtEnd = await helper.blogsInDb()
  // console.log(blogsAtEnd)
  // const usersAtEnd = await helper.usersInDb()
  // console.log(usersAtEnd)
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
      .set('Authorization', `bearer ${token}`)
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

  // 4.12
  test('check if title and url properties exists, if not given, expect err 400', async () => {
    const newPost = {
      author: 'lain',
      likes: '500'
    }
    await api.post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newPost)
      .expect(400)

    const blogs = await Blog.find({})
    const blogwithAdded = blogs.map(blog => blog.toJSON())
    expect(blogwithAdded).toHaveLength(helper.initialBlog.length)
  })

  // 4.13
  test('deleting a blog post', async () => {
    const blogs = await Blog.find({})
    const blogArray = blogs.map(blog => blog.toJSON())

    const blogToDelete = blogArray[0]

    // console.log('before deleting',blogArray)
    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogAfterDeletion = await Blog.find({})
    const blogArrayAfterDeletion = blogAfterDeletion.map(blog => blog.toJSON())
    const blogTitles = blogArrayAfterDeletion.map(b => b.title)

    // console.log('after deleting', blogArrayAfterDeletion)

    expect(blogArrayAfterDeletion).toHaveLength(helper.initialBlog.length - 1)
    expect(blogTitles).not.toContain(blogToDelete.title)
  })

  // 4.14
  test('changing likes', async () => {

    const blogs = await Blog.find({})
    const blogArray = blogs.map(blog => blog.toJSON())
    const blogToChange = blogArray[0]

    const changesToBlog = {
      title: blogToChange.title,
      author: blogToChange.author,
      url: blogToChange.url,
      likes: 77777
    }

    await api.put(`/api/blogs/${blogToChange.id}`)
      .send(changesToBlog)
      .expect(200)

    const blogAfterEditing = await Blog.find({})
    const blogArrayAfterEditing = blogAfterEditing.map(blog => blog.toJSON())
    const editedBlog = blogArrayAfterEditing[0]
    // console.log(editedBlog)

    expect(editedBlog.likes).toBe(77777)
  })


  // 4.22
  test('adding blog fails if not provided with token', async () => {
    const newPost = {
      title: 'PRESENT DAY PRESENT TIME',
      author: 'lain',
      url: 'http://www.google.com',
      likes: 13
    }

    await api.post('/api/blogs')
      .send(newPost)
      .expect(401)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlog.length)

    const blogTitles = response.body.map(r => r.title)
    expect(blogTitles).not.toContain('PRESENT DAY PRESENT TIME')

  })

  // extra:
  test('other users should not be able to delete other\'s post', async () => {
    const blogs = await Blog.find({})
    const blogArray = blogs.map(blog => blog.toJSON())

    const blogToDelete = blogArray[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${badToken}`)
      .expect(400)

    const blogAfterDeletion = await Blog.find({})
    expect(blogAfterDeletion).toHaveLength(helper.initialBlog.length)

    const blogArrayAfterDeletion = blogAfterDeletion.map(blog => blog.toJSON())
    const blogTitles = blogArrayAfterDeletion.map(b => b.title)
    expect(blogTitles).toContain(blogToDelete.title)
  })


})




afterAll(() => {
  mongoose.connection.close()
})