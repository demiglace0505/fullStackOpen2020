// for printing console log messages
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

// for printing error messages
const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}