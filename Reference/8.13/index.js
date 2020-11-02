require('dotenv').config()

const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./gql/typeDefs.js')
const resolvers = require('./gql/resolvers.js')

const MONGODB_URI = process.env.URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((err) => {
    console.log('error connecting to MongoDB:', err.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})