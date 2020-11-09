<<<<<<< HEAD
require('dotenv').config()
const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
=======
const { UserInputError } = require('apollo-server')
>>>>>>> ea663b6790a9af7623b778452ac9e8309cb729db

const Author = require('../models/author.js')
const Book = require('../models/book.js')
const User = require('../models/user.js')

const JWT_SECRET = process.env.JWT_SECRET

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
      return Book.find({})
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => context.currentUser
  },
  Author: {
    bookCount: async (root) => {
<<<<<<< HEAD
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
=======
      const author = await Author.findOne({name: root.name})
      
      return await Book.find({
        // searches for a book's author.name field
        author: author._id
        // "author.name": { $in: [root.name] }
        // name: { author: { $in: [root.name] } }
      }).countDocuments()
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author })
>>>>>>> ea663b6790a9af7623b778452ac9e8309cb729db

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

      return book
    },
<<<<<<< HEAD
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError("not authenticated")
      }

=======
    editAuthor: async (root, args) => {
>>>>>>> ea663b6790a9af7623b778452ac9e8309cb729db
      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo

      try {
        await author.save()
<<<<<<< HEAD
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
=======
      }
      catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args
        })
      }

      return author
>>>>>>> ea663b6790a9af7623b778452ac9e8309cb729db
    }
  }
}

module.exports = resolvers