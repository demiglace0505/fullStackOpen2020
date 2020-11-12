require('dotenv').config()
const { UserInputError, AuthenticationError, PubSub } = require('apollo-server')
const jwt = require('jsonwebtoken')

const Author = require('../models/author.js')
const Book = require('../models/book.js')
const User = require('../models/user.js')

const JWT_SECRET = process.env.JWT_SECRET
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => {
      // if (args.author && args.genre) {
      //   return books.filter(b =>
      //     b.author === args.author &&
      //     b.genres.includes(args.genre)
      //   )
      // }
      // if (args.author) {
      //   return books.filter(b => b.author === args.author)
      // }
      if (args.genre) {
        return Book.find({ genres: args.genre })
      }
      return Book.find({}).populate('author')
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => context.currentUser
  },
  Author: {
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name })
      return await Book.find({ author: author._id }).countDocuments()
      // // alternative: using populate
      // const books = await Book.find({}).populate('author')
      // return books.filter(b => b.author.name === root.name).length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const author = await Author.findOne({ name: args.author })

      if (!context.currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      if (!author) {
        const newAuth = new Author({
          name: args.author,
        })
        await newAuth.save()
        const book = new Book({
          ...args,
          author: newAuth
        })
        try {
          await book.save()
        }
        catch (err) {
          throw new UserInputError(err.message, {
            invalidArgs: args
          })
        }
        return book
      }

      const book = new Book({
        ...args,
        author: author,
      })

      try {
        await book.save()
      }
      catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo

      try {
        await author.save()
      }
      catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args
        })
      }

      return author
    },
    createUser: (root, args) => {
      const user = new User({ ...args })
      return user.save()
        .catch(err => {
          throw new UserInputError(err.message, {
            invalidArgs: args
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'testPass') {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers