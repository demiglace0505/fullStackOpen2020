const config = require('./utils/config.js')
const express = require('express')
const app = express()
const cors = require('cors')
const bloglistRouter = require('./controllers/bloglist.js')
const middleware = require('./utils/middlewares.js')
const logger = require('./utils/logger.js')
const mongoose = require('mongoose')

logger.info('connecting to: ', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to Mongo DB')
  })
  .catch((err) => {
    logger.error('error connecting to MongoDB:', err.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', bloglistRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app