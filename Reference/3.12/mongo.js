const mongoose = require('mongoose')

// COMMAND LINE PARAMETERS
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {

    const url = `mongodb+srv://fullstacker:${password}@cluster0-hp62y.mongodb.net/phonebook-app?retryWrites=true&w=majority`

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(res => console.log('conneceted to DB'))
        .catch(err => console.log(err))

    const person = new Person({
        name: name,
        number: number,
    })

    person.save()
        .then(result => {
            console.log('entry saved!')
            mongoose.connection.close()
        })
} else if (process.argv.length === 3) {
    const url = `mongodb+srv://fullstacker:${password}@cluster0-hp62y.mongodb.net/phonebook-app?retryWrites=true&w=majority`

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(res => console.log('conneceted to DB'))
        .catch(err => console.log(err))

    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person);
        })
        mongoose.connection.close()
    })
} else {
    console.log('Please provide the following format: node mongo.js <password> <name> <number>')
    process.exit(1)
}

