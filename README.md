## [Part 3 - Programming a server with NodeJS and Express](https://fullstackopen.com/en/part3)

> **Important concepts learned**
>
> Node.js and Express routers
>
> Postman
>
> json-parser (express.json())
>
> Deploying to Heroku
>
> MongoDB, mongoose validators
>
> ESLint

* [3a Node.js and Express](#3a-node-js-and-express)
* [3b Deploying app to internet](#3b-deploying-app-to-internet)
* [3c Saving data to MongoDB](#3c-saving-data-to-mongodb)
* [3d Validation and ESLint](#3d-validation-and-eslint)

## 3a: Node.js and Express

> **Tech used:**
> Node, Express, [nodemon](https://github.com/remy/nodemon), [json-parser](https://expressjs.com/en/api.html), [morgan](https://github.com/expressjs/morgan)

In this segment, a simple web server was created using Express. I also learned about fetching via REST, and also the other REST operations like POST, PUT and DELETE. I learned to use tools like Postman and the VSCode Rest Client extension for making requests. I also learned to parse data received from the server by using **express.json()** middleware. Finally, I made a simple middleware function for logging requests using the third party library morgan.

#### 3.1 - Fetching from a hardcoded list

I first setup an express router to `/api/persons`, then fetched using the get method of an express object. The fetch target is a hardcoded array of people.

```
const app = express()
app.use(express.json())

app.get('/api/persons', (req, res) => {
    res.json(persons)
})
```

#### 3.2 - Creating another router endpoint

I created another router endpoint to `/api/info`, which should return the number of persons in the array, and the current date.

```
app.get('/api/info', (req, res) => {
    res.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <br>
    <div>${new Date()}</div>
    `
    )
})
```

#### 3.3 - Fetching a single resource

Fetching a single resource can be done by defining parameters such as `:id` using the colon syntax. The person to be looked for should have its id match with the request's id parameter.

```
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find( p => p.id === id )

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})
```

#### 3.4 - Deleting a resource

To delete a resource, an endpoint with the delete method has to be made.

```
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})
```

Then, Postman or VSCode rest client can be used to send and test a delete operation

```
DELETE http://localhost:3001/api/persons/2
```

#### 3.5 - Adding of new entries

Adding of new entries can be done using the post method on the designated router endpoint. It is worth noting that concat is used since concat returns a new array.

```
app.post('/api/persons', (req, res) => {
    const body = req.body

    // check if no name and number
    if (!body.name && !body.number) {
        return Response.status(400).json({
            error: 'content missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    console.log(person)

    persons = persons.concat(person)
    res.json(person)
})
```

Using VSCode Rest client, the POST operation can be tested

```
POST http://localhost:3001/api/persons
Content-Type: application/json

{
    "name": "Arto Hellas",
    "number": "12354-34638"
}
```

#### 3.6 - Error handling

The request object can be checked first if it contains the appropriate parameters. If it fails a check, a status 400 error is returned.

```
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
    console.log(person)

    persons = persons.concat(person)
    res.json(person)
})
```

#### 3.7 - Morgan Middleware for logging

After installing morgan, it is added as a middleware to the express app. Morgan is a middleware for printing requests info into the console. 

```
app.use(express.json())
app.use(morgan('combined'))
```

#### 3.8 - Configuring Morgan

To make morgan output a specific set of data, it has to be configured:

```
morgan.token('object', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))
```

## 3b: Deploying app to internet

> **Tech used:**
> [Node cors](https://github.com/expressjs/cors), Heroku, [express static](http://expressjs.com/en/starter/static-files.html), proxy

In this part, I learned to deploy an application to the internet via Heroku. I also learned to make use of a proxy address with the frontend. Since the production build will have a relative URL to 3000/api/notes, whereas the backend is at 3001, the proxy redirects it to 3001.

#### 3.9 - Making the backend work with the frontend

If we were to connect the note app frontend from part 2 into this backend, it turns out that it is not possible due to CORS. In order to alleviate this, I used Node's cors middleware.

    const cors = require('cors')
    app.use(cors())

#### 3.10 - Deploying the backend to Heroku

To finally deploy the backend to Heroku, I first created a **Procfile** at our project's root directory to tell Heroku how to start the app.

    web: node index.js

I then initialize Heroku on the directory and made a git push to Heroku

    heroku create
    git add .
    git commit -m "commit message"
    git push heroku master

#### 3.11 - Generating a production build of the frontend

It is also possible to deploy our frontend together with the backend (serving static files from backend) by generating a production build of the frontend using npm run build and placing the **build** folder to the root of our backend. We then proceed to use express static middleware

    app.use(express.static('build'))

Now, GET requests to our heroku web address will show the React frontend while GET requests to /api/notes will be handled by the backend.

Because of some changes to the code, the frontend would no longer work properly in dev mode (npm start). We created a proxy address in the package.json to alleviate this.

    "proxy": "http://localhost:3001"

## 3c: Saving data to MongoDB

> **Tech used:**
> MongoDB Atlas, [Mongoose](http://mongoosejs.com/index.html), [dotenv](https://github.com/motdotla/dotenv#readme)

In this part, the focus is using MongoDB Atlas as the provider and also using mongoose library. I learned to create a mongoose model and Schema in this part as well.

#### 3.12 - Setting up MongoDB, Command Line database

I created a cluster in MongoDB Atlas and connected to it using a URI which looks like: `mongodb+srv://<USER>:<PASSWORD>@cluster0-ostce.mongodb.net/test?retryWrites=true`

The process for adding a new entry is by using the command line in this format:

```
node mongo.js <password> <name> <number>
```

The code for this is as follows:

```
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
```

#### 3.13 - Fetching all people from the database

I created a mongoose schema for a person.

```
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema)
```

The code responsible for fetching all persons from the Mongo database is:

```
app.get('/api/persons', (req, res) => {
    Person.find({}).then( people => {
        res.json(people)
    })
})
```

Also, since it would be a bad idea to hardcode the url into the code, it can instead be defined in a .env file using dotenv library. This dotenv file must also be included to gitignore.

    require('dotenv').config()
    const url = process.env.MONGODB_URI

#### 3.14 - Saving new numbers to the database

```
app.post('/api/persons', (req, res) => {
    const body = req.body

    // check if no name or number
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Content Missing!'
        })
    }

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
```

#### 3.15 - Deleting entry from the database

```
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(err => next(err))
})
```

#### 3.16 - Creating an error handler middleware

Instead of having every operation it's own catch error statement, it is more efficient to create a middleware for handling errors.

```
const errHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
}
app.use(errHandler)
```

#### 3.17 - Modifying existing entry in the database

```
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})
```

#### 3.18 - Viewing a single resource

```
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(err => next(err))
})
```



## 3d: Validation and ESLint

> **Tech used:**
> [Mongoose validation](https://mongoosejs.com/docs/validation.html), ESLint

In this part, I learned to use mongoose validators. I also learned to install eslint on projects.

#### 3.19 and 3.20 - Mongoose validator

I installed mongoose-unique-validator package since the builtin mongoose validators does not provide a validator for duplicate names.

```
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
```

For the frontend to display an error message on validation error, a catch block was added.

```
personService.create(newPerson)
    .then((createdPerson) => {
        setPersons(persons.concat(createdPerson))
        setNewName('')
        setNewNumber('')
        setNotifType('success')
        setNotifMessage(
            `Added ${newPerson.name}`
        )
        setTimeout(() => {
            setNotifMessage(null)
            setNotifType(null)
        }, 5000)
    })
    .catch(error => {
        console.log(error.response.data)
        setNotifType('error')
        setNotifMessage(`${error.response.data.error}`)
        setTimeout(() => {
            setNotifMessage(null)
            setNotifType(null)
        }, 5000)
    })
```

#### 3.21 - Deploying to Heroku

In deploying the application to Heroku, dotenv would not work. Instead, the command `heroku config:set` should be used.

```
heroku config:set MONGODB_URI=mongodb+srv://<username>:<password>@cluster0-ostce.mongodb.net/note-app?retryWrites=true
```

