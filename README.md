## [Part 4 - Testing Express Servers, User Administration](https://fullstackopen.com/en/part4)

> **Important concepts learned:**
>
> - Structuring of applications
> - Unit and Integration testing
> - Configuring NODE_ENV variables
> - async/await
> - User authentication using bcrypt and tokens
> - header authorization (bearer)
> - test vs production environment

* [4a Structure of backend application, introduction to testing](#4a-structure-of-backend-application-introduction-to-testing)
* [4b Testing the Backend](#4b-testing-the-backend)
* [4c User Administration](#4c-user-administration)
* [4d Token Authentication](#4d-token-authentication)

___

### 4a Structure of backend application, introduction to testing

> **Tech used**
> jest, lodash

In this part, the focus is **structuring** the application in a cohesive manner. An example is moving all dotenv environment variables into a separate config.js file. The route handlers are moved into a routes directory and the event handlers for these routers into a controllers directory. **Testing** node applications using jest was also tackled in this part.

#### 4.1 - Building a Blog application

In this part, we created an npm project from scratch. The essential dev packages used for the project backbone were `express`, `nodemon`, `cors`, `mongoose` and `dotenv`.
The backbone provided the basic functionalities: connect to a Mongo DB server, define schemas for blogs, and express route handling for simple get and post requests.

#### 4.2 - Refactoring into separate modules

The project was refactored into a more convenient structure rather than being a single index.js file. Each file and directory have their distinct role. The structure of the project is now:
```
├── index.js
├── app.js
├── build
│   └── ...
├── controllers
│   └── bloglist.js
├── models
│   └── blog.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js
```
The **index.js** file is responsible for starting the app. **app.js** establishes the connection to the DB. Inside the **controllers** directory are the route handlers for our blog application. 
The **utils** directory contains utilities such as **config.js** for project environment variables configuration, **logger.js** as our own implementation of console logging and **middleware.js** which contains our middlewares such as logging of request details and handling of errors.

#### 4.3 - Using jest and creating unit tests

We installed jest `npm install --save-dev jest` and modified our package.json to include a test script that will run jest

    {
      // ...
      "test": "jest --verbose"
    }

Additionally, we created a separate helper file under **./utils** called list_helper.js. This helper file contains all the necessary functions for our blog app.

#### 4.4 - Helper function: total likes

We created a `totalLikes` function for our blog. This function returns the total sum of likes in all blog posts. To do so, we used `reduce` method.

```
  blogs.reduce( (acc, curr) => {
    return acc + curr.likes
  }, 0 )
```



#### 4.5 - Helper function: most liked blog

To get the blog with the highest number of likes, we sorted the blogs according to likes in descending order, then we extract the information from the first member.

    const sortedBlogs = blogs.sort((a,b) => b.likes - a.likes)
      const favorite = {
        title: sortedBlogs[0].title,
        author: sortedBlogs[0].author,
        likes: sortedBlogs[0].likes
      }
      return favorite

#### 4.6 - Helper function: blogger with most blogs

Lodash methods were used to tally the amount of blogs by a blogger.

      const count = _.chain(blogs)
        .countBy('author')
        .toPairs()
        .value()

This results into the following array:  

    [ 
      [ 'Edsger W. Dijkstra', 2 ],
      [ 'Robert C. Martin', 3 ],  
      [ 'Michael Chan', 1 ]
    ]

Which we then sort in descending order and finally return in the format:

    {
      author: name
    blogs: ###
    }

Using: 

    const sorted = count.sort( (a,b) => {
        return b[1] - a[1]
      })
      const highestBlogger = {
        'author': sorted[0][0],
        'blogs': sorted[0][1]
      }
      return highestBlogger

#### 4.7 - Helper function: blogger with most likes

To find the author with the most number of likes, the `totalLikes` function from 4.4 was used. We first used lodash to group the blog posts according to author

    const blogsByAuthor  =  _.groupBy(blogs, 'author')

This results to: 

    {
      author1: [
      {blog1},
      {blog2},
      ],
      author2: [
      {blog3},
      {blog4}
      ],
      ....
    }

We create an array of this collection's authors using `Object.keys` and map to a new array containing objects with format

    [
      {
        author: name
        likes: ###
      },
      ...
    ]

and finally sort it in descending order according to likes. We take the values from the first element of the resulting sorted array.

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

### 4b Testing the backend

> **Tech Used**
> cross-env, supertest, async/await, express-async-errors

In this part, I learned to use the NODE_ENV environment variable to specify if the application is a production or test mode. cross-env library is also needed to ensure cross-platform compatibility.

```
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand"
```

Using this, we can declare a different database for testing purposes.

```
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}
```

I learned to use supertest package for writing API tests. I also learned in this chapter to initialize a database before performing tests using the **beforeEach()** function. I also learned of using [express-async-errors](https://github.com/davidbanham/express-async-errors) to eliminate the try-catch portion of error handling.

#### 4.8 - Blog list test: GET

I wrote a test for verifying that HTTP GET requests's response are in JSON format. I also converted the route handler from a promise based function

    bloglistRouter.get('/', (req, res) => {
      Blog.find({})
        .then((blogs) => {
        res.json(blogs.map(blog => blog.toJSON()))
        })
    })

into async/await syntax

    bloglistRouter.get('/', async (req, res) => {
      const blogs = await Blog.find({})
      res.json(blogs.map(blog => blog.toJSON()))
    })

#### 4.9 - Blog list test: Verify unique identifier

Since mongo DB has default identifiers *_id*, we change it into *id* using mongoose's **schema.set()** method

    blogSchema.set('toJSON', {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
      }
    })

#### 4.10 - Blog list test: POST

To test POST requests, we create a `newPost` object with dummy data and make a post request. We then make a GET request and check if the response indeed contains the new data

    await api.post('/api/blogs')
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlog.length + 1)
    
    const blogTitles = response.body.map(r => r.title)
    expect(blogTitles).toContain('This is the title of newPost')

#### 4.11 - Blog list test: Verify if property exists

To make the `likes` property default to zero when not provided, we modified the route handler for post requests

    bloglistRouter.post('/', async (req, res) => {
      const body = req.body
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
      })
    
      const saved = await blog.save()
      res.status(201).json(saved.toJSON())
    })

#### 4.12 - Blog list test: Verify if response is code 400 on bad requests

If the `title` and `url` properties are not provided, the server should return an error code 400. To do so, we applied mongoose validators to our blog schema

    const blogSchema = mongoose.Schema({
      title: {
        type: String,
        required: true
      },
      author: {
        type: String
      },
      url: {
        type: String,
        required: true
      },
      likes: Number
    })

The errorHandler middleware in our **middlewares.js** is the one responsible for sending error 400 on failed validation

    if (err.name === 'ValidationError') {
        return res.status(400).json({error: err.message})
      }

#### 4.13 - Blog list test: Delete

A route handler and a unit test for delete requests was added.

    bloglistRouter.delete('/:id', async (req,res) => {
      await Blog.findByIdAndRemove(req.params.id)
      res.status(204).end()
    }) 

#### 4.14 - Blog list test: Changing number of likes

To allow changing the number of likes on a blog post, we made a route handler for put requests.

    bloglistRouter.put('/:id', async (req, res) => {
      const body = req.body
      const blog = {
        likes: body.likes
      }
      const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
      res.json(updatedBlog.toJSON())
    })

### 4c User Administration

> **Tech used**
> bcrypt, mongoose populate

In this part, I learned about **document database**, specifically, MongoDB. In the material, references are stored in both documents ie: the note references the user who created it and the user references all the notes he created. Using **mongoose populate**, we are able to do join queries. I also learned about **bcrypt**, a library used for generating hashed passwords. It is important practice not to store the actual password in a database. 

#### 4.15 - Creating new users via POST request

I created a model for user.js with the properties *username*, *name* and *passwordHash*. Using **bcrypt**'s `hash()` function to generate the *passwordHash*, I am able to store the hash into the database instead of the actual password.

```
usersRouter.post('/', async (req, res) => {
  const body = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()

  res.json(savedUser)
})
```



#### 4.16 - Adding restrictions to new user properties

I used mongoose-unique-validators to ensure that the username is unique. But since our database stores *passwordHash* instead of the actual password, validators for our password in the model cannot be used so I had to create my own password validator on the route handler itself.

    if (body.password.length < 3) {
        return res.status(400).json({
          error: 'password must be at least 3 characters long'
        })
      }

#### 4.17 - Display references to blog's creator

To store a reference to the user that created a blog post, I modified the blog schema and users schema. For the blog schema, I added:

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }

 And for the user schema:

    blogs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Blog'
        }
      ]

I then modified the post route handler for new blog posts to include the user's id to the blog's property:


    const user = await User.findById(body.userId)
    
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
      })

And I also added the saved blog to the user's collection of blogs

     const saved = await blog.save()
    
      user.blogs = user.blogs.concat(saved._id)
      await user.save()

Instead of just showing ids, we can show the actual content itself using mongoose `populate()` method. We can also choose which properties to display using mongo syntax. We modified the blog route handler: 


     const blogs = await Blog.find({}).populate('user', {
         username: 1,
         name: 1,
         id: 1
      })

And likewise, we did the same to user's route handler


    const users = await User.find({}).populate('blogs', {
        url: 1,
        title: 1,
        author: 1,
        id: 1
      })


### 4d Token Authentication

> **Tech used**
> jsonwebtoken, Authorization header: bearer

Token based authentication is a great way to handle authentication. After the user logs in, the backend sends a token to the browser, which is then attached to requests (ie, creating a note). The backend then identifies the user via the token. **jsonwebtoken** library is used for generating JSON web tokens.

#### 4.18 - Implementing token based authentication

To implement token based authentication, I used both **bcrypt** and **jsonwebtoken**. I created an environment variable called *LOGINTOKEN*, a string of random characters that will be used for signing our tokens using jsonwebtoken's `sign()` method.

I created a new route handler /api/login and used bcrypt's `compare()` method to compare the incoming request's password to the hashed password in the database. The token is then generated using jsonwebtoken's `sign()` method, which will then be attached to the response object.


    const body = req.body
    
      const user = await User.findOne({username: body.username})
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)
    
        if (!(user && passwordCorrect)) {
          return res.status(401).json({
            error: 'invalid username or password'
          })
        }
    
        const userForToken = {
          username: user.username,
          id: user._id
        }
    
        const token = jwt.sign(userForToken, config.LOGINTOKEN)
    
        res.status(200).send({
          token,
          username: user.username,
          name: user.name
        })

#### 4.19 - Limiting creating blog posts to authorized users

To ensure that only logged in users, ie. those with tokens, are able to create blog posts, I used [authorization headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization), specifically the [bearer authentication schema](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Authentication_schemes). The Authorization header for a bearer schema looks like: 

    bearer <token>


I created a getTokenFrom() helper function in our blog route handler to extract the token from our request object.

    const getTokenFrom = request => {
      const authorization = request.get('authorization')
      if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
      }
      return null
    }

I then further modified the /api/blogs post route handler to include token verification using jsonwebtoken's `verify()` method


    const token = getTokenFrom(request)
      const decodedToken = jwt.verify(token, process.env.LOGINTOKEN)
      if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }
      const user = await User.findById(decodedToken.id)

We also modified our error handler to accommodate web token errors:

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'invalid token'
        })
      }

#### 4.20 - Refactoring token extraction into a middleware

The functionality for extracting tokens `getTokenFrom()` from the previous part was refactored into a middleware.

    const tokenExtractor = (req, res, next) => {
      const authorization = req.get('authorization')
      if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7)
      }
      next()
    }

We can access the token in our route handler using `req.token`

#### 4.21 - Token authentication on delete requests

We used token authentication on delete requests so that only the blog's creator can delete his own blog posts. To do this, we modified the blog's delete route handler. We first verified and decoded the token of the request object:


    const decodedToken = jwt.verify(req.token, config.LOGINTOKEN)
      if (!req.token || !decodedToken.id) {
        return res.status(401).json({
          error: 'token missing or invalid'
        })
      }

Once verified, the blog to be deleted was searched, but since fetching data from the db returns an object, we used `toString()` method to compare. The user id of the blog to be delete's writer was compared against that of the request object (from the decoded token) to check if the current logged user is the one who wrote the blog post to be deleted.

    const blog = await Blog.findById(req.params.id)
    if (blog.user.toString() !== decodedToken.id.toString()) {
        return res.status(400).json({
          error: 'cannot delete, you are not authorized'
        })
      }

After deletion, the blog post is deleted, and the user's db entry is updated so as to reflect the removal of the deleted blog from their blog collection.

    const user = await User.findById(decodedToken.id)
      user.blogs = user.blogs.filter(b => b.toString() !== req.params.id)
      await user.save()

#### 4.22 - Fixing tests

Adding token based authentication broke all of our unit tests, so we refactored them. In the `beforeEach()` function, we created a test user

    const tester = {
        username: 'tester',
        name: 'TEST TEST TEST',
        password: 'testPass123'
      }
    
      await api.post('/api/users').send({
        username: tester.username,
        name: tester.name,
        password: tester.password
      })

We then logged the test user in, and extracted their token.

    const loggedTester = await api.post('/api/login')
        .send({
          username: tester.username,
          password: tester.password
        })
      token = loggedTester.body.token

Finally, we initialized the initial blog array with dummy data and had the test user create them. We used **supertest**'s `set()` method to set the authorization header and bearer in our request.

    for (let blog of helper.initialBlog) {
        let blogObject = new Blog(blog)
        await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(blogObject)

Likewise, we added the `set()` method on various tests to include tokens.

    .set('Authorize', 'bearer ${token}')
