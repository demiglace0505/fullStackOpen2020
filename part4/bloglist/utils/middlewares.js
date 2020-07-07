const logger = require('./logger.js')

// for printing request details to console
const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:', req.path)
  logger.info('Body', req.body)
  logger.info('---')
  next()
}

// for unsupported routes
const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: 'unknown endpoint'
  })
}

// error handler
const errorHandler = (err, req, res, next) => {
  logger.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).json({error: 'malformatted id'})
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({error: err.message})
  }
  next(err)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}