const { UserInputError } = require('apollo-server')

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
      if (args.genre) {
        return Book.find({ genres: args.genre })
      }
      return Book.find({})
    },
    allAuthors: () => Author.find({})
  },
  Author: {
    bookCount: async (root) => {
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
    editAuthor: async (root, args) => {
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
    }
  }
}

module.exports = resolvers