require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

// middleware for printing request info to console
// method url status response-length response-time object
morgan.token('object', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

const Person = require('./models/person.js')

// let persons = [
//     {
//         name: "Arto Hellas",
//         number: "040-123456",
//         id: 1
//     },
//     {
//         name: "Ada Lovelace",
//         number: "39-44-5323523",
//         id: 2
//     },
//     {
//         name: "Dan Abramov",
//         number: "12-43-234345",
//         id: 3
//     },
//     {
//         name: "Mary Poppendieck",
//         number: "39-23-6423122",
//         id: 4
//     },
// ]

app.get('/api/info', (req, res) => {
    res.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <br>
    <div>${new Date()}</div>
    `
    )
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
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

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(err => next(err))
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    // check if no name or number
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Content Missing!'
        })
    }
    // // check for duplicate
    // if (persons.some(p => p.name === body.name)) {
    //     return res.status(400).json({
    //         error: 'Name already exist!'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId(),
    })
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
    // console.log(person)
})

const generateId = () => {
    return Math.floor(Math.random() * 1000 + 1)
}

const errHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
}
app.use(errHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
