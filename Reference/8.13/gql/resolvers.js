const {UserInputError} = require('apollo-server')

const Author = require('../models/author.js')
const Book = require('../models/book.js')


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
      // if (args.genre) {
      //   return books.filter(b => b.genres.includes(args.genre))
      // }
      return Book.find({})
    },
    allAuthors: () => Author.find({})
  },
  Author: {
    bookCount: (root) => books.filter(b => b.author === root.name).length
  },
  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({name: args.author})

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
        catch(err) {
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
    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) {
        return null
      }
      const updatedAuthor = {
        ...author,
        born: args.setBornTo
      }
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor
    }
  }
}

module.exports = resolvers