// for printing console log messages
const info = (...params) => {
  console.log(...params)
}

// for printing error messages
const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}