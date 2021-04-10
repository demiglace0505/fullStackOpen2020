const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

// console.log(process.env.NODE_ENV)
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

