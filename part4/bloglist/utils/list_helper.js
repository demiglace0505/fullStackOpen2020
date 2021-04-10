const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((acc, curr) => {
      // console.log(acc, curr.likes)
      return acc + curr.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
  const favorite = {
    title: sortedBlogs[0].title,
    author: sortedBlogs[0].author,
    likes: sortedBlogs[0].likes
  }
  return favorite
}

const mostBlogs = (blogs) => {
  // const authors = blogs.map(blog => blog.author)
  // console.log(authors)

  // const count = _.chain(authors)
  //   .countBy()
  //   .toPairs()
  //   .value()

  const count = _.chain(blogs)
    .countBy('author')
    .toPairs()
    .value()
  // console.log(count)
  const sorted = count.sort( (a,b) => {
    return b[1] - a[1]
  })

  const highestBlogger = {
    'author': sorted[0][0],
    'blogs': sorted[0][1]
  }

  return highestBlogger
}

const mostLikes = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, 'author')
  // console.log(blogsByAuthor)
  const sorted = Object.keys(blogsByAuthor)
    .map(author => {
      return {
        author: author,
        likes: totalLikes(blogsByAuthor[author])
      }
    })
    .sort( (a,b) => {
      return b.likes - a.likes
    })

  const mostLikedAuthor = {
    author: sorted[0].author,
    likes: sorted[0].likes
  }
  
  return mostLikedAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}