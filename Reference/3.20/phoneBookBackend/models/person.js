const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(err => {
        console.log('error connecting to MongoDB:', err.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        minlength: 8
    }
})
personSchema.plugin(uniqueValidator, {message: 'Error, expected {PATH} to be unique.'})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
    }
})


module.exports = mongoose.model('Person', personSchema)