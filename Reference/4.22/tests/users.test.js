const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper.js')
const app = require('../app.js')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user.js')


describe('Testing for create user functionality', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('root-testPass123', 10)
    const user = new User({
      username: 'root-test',
      passwordHash
    })
    
    await user.save()
  })

  test('returns error 400 if username is taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root-test',
      name: 'root-test',
      password: 'root-testPass123'
    }

    const result = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('returns 400 if username is < 3 chars long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'su',
      name: 'superuser',
      password: 'suPass123'
    }

    const result = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    // console.log(result.body.error)
    expect(result.body.error).toContain('Path `username` (`' + newUser.username + '`) is shorter than the minimum allowed length')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('returns 400 if password is < 3 chars long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'superuser',
      name: 'superuser',
      password: 'su'
    }

    const result = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    // console.log(result.body.error)
    expect(result.body.error).toContain(`password must be at least 3 characters long`)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })


})

afterAll(() => {
  mongoose.connection.close()
})