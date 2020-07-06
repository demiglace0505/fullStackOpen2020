const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce( (acc, curr) => {
      console.log(acc, curr.likes)
      return acc + curr.likes
    }, 0 )
}

module.exports = {
  dummy,
  totalLikes
}