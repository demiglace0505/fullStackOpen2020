require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('object', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

const url = process.env.MONGODB_URI
console.log('connecting to ', url)

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then( result => {
        console.log('connected to MongoDB')
    })
    .catch( err => {
        console.log('error connecting to MongoDB: ', err.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema)

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    },
]

app.get('/api/info', (req, res) => {
    res.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <br>
    <div>${new Date()}</div>
    `
    )
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then( people => {
        res.json(people)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    // check if no name or number
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Content Missing!'
        })
    }
    // check for duplicate
    if (persons.some(p => p.name === body.name)) {
        return res.status(400).json({
            error: 'Name already exist!'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    // console.log(person)

    persons = persons.concat(person)
    res.json(person)
})

const generateId = () => {
    return Math.floor(Math.random() * 1000 + 1)
}

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
