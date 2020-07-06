const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce( (acc, curr) => {
      // console.log(acc, curr.likes)
      return acc + curr.likes
    }, 0 )
}

const favoriteBlog = (blogs) => {
  const sortedBlogs = blogs.sort((a,b) => b.likes - a.likes)
  const favorite = {
    title: sortedBlogs[0].title,
    author: sortedBlogs[0].author,
    likes: sortedBlogs[0].likes
  }
  return favorite
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}