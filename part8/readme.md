## [Part 8 - GraphQL](https://fullstackopen.com/en/part8)

> **Important concepts learned:**
>
> - Apollo GraphQL
> - Defining schema
> - Making Queries, Mutations
> - Adding token to request headers
> - PubSub()

* [8a GraphQL-server](#8a-graphql-server)
* [8b React and GraphQL](#8b-react-and-graphql)
* [8c Database and user administration](#8c-database-and-user-administration)
* [8d Login and updating the cache](#8d-login-and-updating-the-cache)
* [8e Fragments and subscriptions](#8e-fragments-and-subscriptions)

___

### 8a GraphQL-server

> **Tech used**
>
> GraphQL schemas, queries and mutations
>
> Apollo-server

GraphQL is the main focus in this part. GraphQL forms a query describing the data we want. In this chapter, I learned about GraphQL schemas and how to make queries. GraphQL is advantageous and easy to use because the query describes what kind of data we want as a response. Apollo is the GraphQL server of choice of the material. GraphQL playground is automatically run on port 4000 whenever apollo-server is run on development mode. Here, we can make queries and see their responses.

#### 8.1 - Setting up Apollo Server and basic querying

A basic boilerplate was provided from https://github.com/fullstack-hy2020/misc/blob/master/library-backend.js. I installed apollo-server and graphql into the project

```
npm install --save apollo-server graphql
```

I then defined two queries: bookCount and authorCount. Both of them returns a non-nullable integer value.

```jsx
const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
  }
`
```

I then created a resolver, which defines how the GraphQL queries are responded to. To return the number of books and number of authors, I just simply returned the length of the books and authors array.

```jsx
const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length
  }
}
```

Queries are sent via the Apollo server's GraphQL playground, which automatically runs on port 4000 whenever the app is run in development mode.

#### 8.2 Listing all books

I first defined in the schema an object of type Book, then I added a query for allBooks. This query should return an array of Book objects.

```jsx
const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: String!
    genres: [String!]
    id: ID!
  }

  type Query {
    allBooks: [Book!]!
  }
```

I then added a resolver for the allBooks query to return the books array.

```jsx
const resolvers = {
  Query: {
    allBooks: () => books
  }
}
```

The resolver for type Book isn't needed to be defined anymore, since apollo automatically makes a default resolver for them. 

#### 8.3 All authors

I first defined the Author type in the schema. I gave it the fields name, born, id and bookCount. Then, I created a query for allAuthors, which returns an array of Authors.

```jsx
  type Author {
    name: String!
    born: Int!
    id: ID!
    bookCount: Int!
  }

  type Query {
    //
    allAuthors: [Author!]!
  }
`
```

A resolver for the Author type's bookCount field was then custom made, because the default resolver is only good for the author's name and born fields. Also, the resolver for the allAuthors query was added.

```jsx
const resolvers = {
  Query: {
    //
    allAuthors: () => authors
  },
  Author: {
    bookCount: (root) => books.filter( b => b.author === root.name).length
  }
}
```

#### 8.4 Books from a specific author

The Query for allBooks was modified to allow an optional parameter author.

```jsx
 type Query {
    allBooks(author: String): [Book!]!
  }
```

Then, the resolver for the Query allBooks was modified. It now first checks if there is an author parameter given in the request.

```jsx
  Query: {
    //
    allBooks: (root, args) => !args.author ? books : books.filter(b => b.author === args.author),
  },
```

#### 8.5 Books according to genre

Another optional parameter genre was added to the allBooks query

```jsx
  type Query {
    allBooks(author: String, genre: String): [Book!]!
  }
```

The resolver for allBooks was then expanded. Instead of using ternary conditionals, it is much better to now expand it to multiple if statements.

```jsx
allBooks: (root, args) => {
  if (args.author && args.genre) {
    return books.filter(b => 
      b.author === args.author &&
      b.genres.includes(args.genre)
    )
  }
  if (args.author) {
    return books.filter(b => b.author === args.author)
  }
  if (args.genre) {
    return books.filter(b => b.genres.includes(args.genre))
  }
  return books
},
```

#### 8.6 Adding a new book

I defined the mutation for adding a new book.

```jsx
type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]
    ): Book
  }
```

I then created the resolver for this mutation. This first checks if the author of the new book already exists in the server. If it doesn't exist yet, it gets added to the server. This functionality is accomplished using array some method.

```jsx
Mutation: {
    addBook: (root, args) => {
      if (!authors.some(a => a.name === args.author)) {
        const newAuth = {
          name: args.author,
          id: uuid()
        }
        authors = authors.concat(newAuth)
      }

      const book = { ...args, id: uuid() }
      books = books.concat(book)
      return book
    }

  }
```

#### 8.7 Updating Author birthyear

I created editAuthor Mutation for editing the birthyear of an author

```jsx
 type Mutation {
    //
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
```

Then, I created the resolver for this mutation. It first finds the author to be edited based on the name given as parameter. Once found, the authors array is updated using array map method with the new author object.

```jsx
Mutation: {
  //
      editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) {
        return null
      }
      const updatedAuthor = {
        ...author,
        born: args.setBornTo
      }
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor
    }
}
```

### 8b React and GraphQL

> **Tech used**
>
> Apollo Client
>
> GraphQL variables
>
> useQuery, useLazyQuery
>
> caching
>
> useMutation

Using the @apollo/client library, we can now use Apollo Client in our app. **useQuery()** hooks is the dominant practice for making queries with Apollo Client. Using **GraphQL variables**, we are able to give parameters to our queries. Using query parameters is also possible in the GraphQL playground. **useLazyQuery()** hook was also introduced, which is useful when we want to make a query only on demand.

**useMutation()** hook provides us the functionality to make mutations. useMutation()'s **refetchQueries** parameter enables us to do another query after a mutation.

The handling and management of application state has mostly become the responsibility of Apollo Client.

#### 8.8 Setting up and implementing author's view

First I installed the necessary dependencies: graphql and @apollo/client

I then setup Apollo Client in the app's index.js file. The App component is to be wrapped inside an ApolloProvider component in order to make the apollo client accessible to all components.

```jsx
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
})

ReactDOM.render(
  <ApolloProvider client={client} >
    <App />
  </ApolloProvider>
  , document.getElementById('root'))
```

I also created a separate directory queries/queries.js that will contain all the queries from this point onward. I created a query for getting all authors from the backend. The necessary fields are name, born and bookCount.

```jsx
export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`
```

I then made use of useQuery hooks from apollo client for making queries. I also made a small conditional rendering to avoid having errors when the content isn't fetched yet.

```jsx
const authors = useQuery(ALL_AUTHORS)

  if (authors.loading) {
    return <div>loading...</div>
  }
```

The data from the author array itself is contained within authors.data.allAuthors

  {authors.data.allAuthors.map(a => ...

#### 8.9 Books view

Similar to the previous exercise, I first created a query for getting all books from the backend

```jsx
export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
  `
```

I then used useQuery hook to make a query to the backend

```jsx
  const books = useQuery(ALL_BOOKS)
```

The data is located at

```jsx
  {books.data.allBooks.map(a =>...
```

#### 8.10 Adding a new book

For adding new books, I first created a mutation in our queries.js file

```jsx
export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!,
    $author: String!,
    $published: Int!,
    $genres: [String!]
    ) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author
      published
      genres
    }
  }
`
```

Using **useMutation()** hook, we can make mutations. I also used **refetchQueries** parameter of the useMutation hook in order to run a query upon successful mutation, in this case, I ran ALL_BOOKS once again to update the listing of books after adding a book.

```jsx
 const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{query: ALL_BOOKS}]
  })
```

Then createBook function is added to the submit event handler. The variables from the different input fields are passed as parameters into this function.

```jsx
createBook({
  variables: {
    title, author, published, genres
  }
})
```

#### 8.11 Editing author's birthyear

First I created a simple form that asks for a name and a year. The input boxes utilizes **useState()** hooks to save state. The states variables were named as name and year.

I then created a mutation in our queries.js file for editing birthyear.

```jsx
export const EDIT_BIRTHYEAR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name
      born
    }
  }
`
```

Like the previous exercise, I then made use of useMutation hook to make a mutation, and together with it, refetchQueries to "reload" the authors array.

```jsx
  const [changeBirthyear] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })
```

I then added the changeBirthyear function into the form's event handler. In it, I pass the variable name and year as name and setBornTo, respectively.

```jsx
changeBirthyear(
  {
    variables: {
      name: name,
      setBornTo: parseInt(year)
    }
  }
)
```

#### 8.12 Using a dropdown selector

In order to allow selection of only existing authors, a dropdown selector functionality was implemented. The <select> tag of HTML was used for this. Using array map, I mapped the individual author's names into different options.

```jsx
<select
    value={name}
    onChange={(event) => setname(event.target.value)}
  >
    {authors.data.allAuthors.map( a => 
      <option key={a.name} value={a.name}>{a.name}</option>
    )}
</select>
```



### 8c Database and user administration

> **Tech Used**
>
> mongoose
>
> error-handling: userInputError
>
> ApolloServer context parameter

In this segment, the backend for the application was made. Validation of user input was also one of the main focus of this segment.

#### 8.13 - Setting up Mongo, Schemas, Queries and resolvers

I first installed the necessary dependencies such as **mongoose, mongoose-unique-validator, dotenv**. I then created a mongoose schema for *author.js* and *book.js*. I restructured the program to make it tidier and easier to manage by moving the *resolvers* and *typeDefs* into a separate directory and exporting them using ES6 module.exports syntax.

I hooked up the index.js file to the remote MongoDB Atlas server. I made use of dotenv to obfuscate the address of the remote server. Apollo server was also configured.

```jsx
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
```

As required by the material, the graphql schema for Book was modified so that the author field accepts type Author instead of a string.

```jsx
type Book {
  ...
  author: Author!
}
```

Finally, the resolvers were refactored. For this part, the parameters for the allBook query, bookCount field of an author object, author field of a book, and editAuthor mutation doesn't need to work right away.

 For bookCount and authorCount queries, I simply made use of **countDocuments()** method of mongo collections in order to obtain the number of items. For allBooks and allAuthors query, I simply made use of mongo's **find()** method.

The addBook mutation had some significant changes in order to accommodate the change in the Book schema to only accept a type Author for the author field. The code first looks for the given author name in the database, if not found, a new Author object is created and saved. Afterwards, the Book object is created, and the author object is passed onto it. 

```jsx
addBook: async (root, args) => {
  const author = await Author.findOne({name: args.author})

  if (!author) {
    const newAuth = new Author({
      name: args.author,
    })
    await newAuth.save()
    const book = new Book({
      ...args,
      author: newAuth
    })
    try {
      await book.save()
    }
    catch(err) {
      throw new UserInputError(err.message, {
        invalidArgs: args
      })
    }
    return book
  }

  const book = new Book({
    ...args,
    author: author,
  })

  try {
    await book.save()
  }
  catch (err) {
    throw new UserInputError(err.message, {
      invalidArgs: args
    })
  }

  return book
```

#### 8.14 - Resolvers

To incorporate addition of an optional genre parameter to the allBooks query, a conditional was added.

```jsx
if (args.genre) {
  return Book.find({ genres: args.genre })
}
```

The editAuthor mutation was also modified to make use of the mongo server.

```jsx
const author = await Author.findOne({ name: args.name })
author.born = args.setBornTo

try {
  await author.save()
}
catch (err) {
  throw new UserInputError(err.message, {
    invalidArgs: args
  })
}

return author
```
For the bookCount field of an Author, the Author collection is first queried, then queries the Book collection using the author's id. 

```jsx
  Author: {
    bookCount: async (root) => {
      const author = await Author.findOne({name: root.name})
      
      return await Book.find({
        author: author._id
      }).countDocuments()
    }
  },
```

A more efficient alternative is by using mongoose' populate() function. This way, the Author collection doesn't need to be queried anymore.

```jsx
const books = await Book.find({}).populate('author')
return books.filter(b => b.author.name === root.name).length
```



#### 8.15 - Error handling

For handling validation errors, **UserInputError** from apollo-server was used. This is done by wrapping the save method in a try catch statement.

```jsx
    try {
      await book.save()
    }
    catch (err) {
      throw new UserInputError(err.message, {
        invalidArgs: args
      })
```

#### 8.16 - Users and logging in

As instructed by the material, I updated typeDefs to include a new type *User*, *Token*, a new query *me* and mutations *createUser* and *login*. I then created a new mongoose schema for the user. 

I then defined the resolvers for createUser and login

To enable user management such as logging in, I edited index.js and added a third parameter [context](https://www.apollographql.com/docs/apollo-server/data/data/#context-argument) to the apollo server's constructor. This segment checks if there is an incoming header, specifically, a bearer authorization, and then parses the token using jsonwebtoken.

```jsx
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})
```

I then defined the resolvers for createUser, which is quite simple.

```jsx
createUser: (root, args) => {
  const user = new User({ ...args })
  return user.save()
    .catch(err => {
      throw new UserInputError(err.message, {
        invalidArgs: args
      })
    })
},
```

For the login functionality, the material suggested to use hardcoded passwords for now. A token is generated using jsonwebtoken.

```jsx
login: async (root, args) => {
  const user = await User.findOne({ username: args.username })
  if (!user || args.password !== 'hardCodedPass') {
    throw new UserInputError("wrong credentials")
  }
  const userForToken = {
    username: user.username,
    id: user._id
  }
  return { value: jwt.sign(userForToken, JWT_SECRET) }
}
```

Finally, addBook and editAuthor was modified so that it throws an error when a user is not logged in. This was done by making use of the third parameter context.

```jsx
editAuthor: async (root, args, context) => {
  if (!context.currentUser) {
    throw new AuthenticationError("not authenticated")
  }
```

Note that to test the query *me* and the new addBook and editAuthor mutations, the Authorization and bearer token must be manually added to apollo playground's HTTP headers.

```jsx
{
  "Authorization": "bearer eyJh....."
}

```

### 8d Login and updating the cache

> **Tech Used**
>
> adding token to header
>
> apollo server resetStore()
>
> setContext
>
> updating cache using update callback of useMutation

In this part, I created a query for logging in. A state for the token was implemented in the app as well. The login form component used useEffect hook to obtain token from the local storage. A great deal of focus is made on the logging in functionality and its tokens. Logging in can be done by using a mutation, which returns a token.

#### 8.17 - Fixing allBooks query in the front end

Due to the changes made in the backend, specifically, changing allBooks query to return an Author, the frontend no longer works as expected. To fix this, a simple change in the *ALL_BOOKS* query was made. 

```jsx
  query {
    allBooks {
      title
      published
      author{
        name
        born
        bookCount
      }
    }
```

Another minor change that has to be made is to change the return value of the map function from *author* to *author.name*

It is important to note that, for the backend's Book collection to access the Author collection, mongoose's **populate()** method was used. This change was made in the resolvers.js file of the backend, under Query allBooks.

```jsx
return Book.find({}).populate('author')
```

#### 8.18 - Implementing user login

I first created a graphql mutation for logging in

```jsx
export const LOGIN = gql`
  mutation($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password
    ) {
      value
    }
  }
`
```

I then added a token state to the app component and used the token to perform conditional rendering on the tabs.

```jsx
const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>

        <Authors show={page === 'authors'} />
        <Books show={page === 'books'} />
        <LoginForm show={page === 'login'} setToken={setToken} />
      </div>
    )
  }
  
  return (
  	...
  )
}
```

A new LoginForm.js component was made, and this component is responsible for the login functionality and UI. It uses apollo's **useMutation()** hooks to perform the login mutation, and also makes use of **useEffect()** hook to set the logged in user's token to localStorage.

```jsx
const LoginForm = (props) => {
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      props.setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()
    await login({
      variables: {
        username,
        password
      }
    })
  }
  ...
```

The form's submit event handler calls the callback function from the useMutation() hook and passes into it the username and password from the form input fields. For the sake of simplicity, the passwords are hardcoded for this exercise.

A logout functionality is also nice to have. Simply clearing the token from the App's state and removing it from local storage would not be enough. The cache is also cleared using **resetStore()** method of an Apollo client object which is accessed using the **useApolloClient()** hook

```jsx
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
```

Also, to fix adding of new books, the query was changed to reflect the changes in the author from String to an Author object made in previous exercises.

#### 8.19 - Books according to genre

I created a query for allBooks with a genre parameter.

```jsx
export const ALL_BOOKS_WITH_GENRE = gql`
  query allBooksWithGenre(
    $genreToSearch: String!
  ) {
    allBooks(
      genre: $genreToSearch
    ){
      title
      published
      author{
        name
        born
        bookCount
      }
    }
  }
`
```

For filtering, I made use of **useState()** hooks to save the filter to the Books component. I then extracted the genres from all books into one array. This was done by first consolidating all genres into one array, and then eliminating duplicates using a clever implementation of array filter.

```jsx
  let allGenres = []
  books.data.allBooks.forEach((b) => {
    allGenres = allGenres.concat(b.genres)
  })
  allGenres = allGenres.filter((value, index, self) => self.indexOf(value) === index)
```

I then made use of array map to create one button for each genre.

```jsx
  {allGenres.map(g =>
    <button
      key={g}
      onClick={() => setFilter(g)}
    >{g}</button>
  )}
  <button onClick={() => setFilter('all genres')}>all genres</button>
```

To selectively render according to the filtered genre, I used array filter and includes methods.

```jsx
let bookArr = []
if (filter === 'all genres') {
  bookArr = books.data.allBooks
} else {
  bookArr = books.data.allBooks.filter((b) => b.genres.includes(filter))
}
```

#### 8.20 - Books according to logged user's favorite genre

I refactored the Books component by extracting the code for generateTable() into its own separate file under /helpers/.  generateTable() now takes an array of books as its parameter. I then created a new tab view and component called Recommended.js. It is similar to the Books component, but this one also queries the current logged user.

Since the resolver for query me depends in the backend makes use of context, it is important that the frontend also access the context using **setContext()** from apollo-link-context.

To query the current logged user, I wrote a query for *me* in the queries.js file

```jsx
export const WHOAMI = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`
```

The array of books according to the logged user's favorite genre can now be queried.

```jsx
  const faveGenre = user.data.me.favoriteGenre
  const bookArr = books.data.allBooks.filter((b) => b.genres.includes(faveGenre))
```



#### 8.22 - Updating the cache

The previous solution of using **refetchQueries** option of the useMutation hook's disadvantage is that the query is always rerun with any update, which is wasteful. A better approach is done using the [update](https://www.apollographql.com/docs/react/api/react/hooks/#options) option. This callback is run after mutation.

```jsx
update: (store, response) => {
  const dataInStore = store.readQuery({query: ALL_BOOKS})
  store.writeQuery({
    query: ALL_BOOKS,
    data: {
      ...dataInStore,
      allBooks: [
        ...dataInStore.allBooks,
        response.data.addBook
      ]
    }
  })
}
```

### 8e Fragments and subscriptions

> **Tech Used**
>
> Query fragments
>
> subscriptions
>
> PubSub()
>
> Apollo split()

In this part, I learned to make use of Query fragments to simplify queries with similar return fields. I also learned about subscriptions: with this, the client can listen to the server for updates. When a change occurs in the server, it sends a notification to the subscribers. The server uses websockets and listens for subscriptions in the address `ws://localhost:4000/graphql`. Using the hook **useSubscription()**, the frontend can listen for subscriptions.

#### 8.23 - Implementing subscriptions on the backend server

I first created a new schema definition for subscriptions to the addBook mutation.

```jsx
  type Subscription{ 
    bookAdded: Book!
  }
```

I then imported the **PubSub()** class to resolvers.js and used its **publish()** method to notify the subscribers when an addBook mutation occurs.

```jsx
  Mutation: {
    addBook: async (root, args, context) => {
      ...
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },
```

A resolver for the Subscription has to be made as well. It returns an [AsyncOperator](https://www.apollographql.com/docs/graphql-subscriptions/subscriptions-to-schema/) object.

```jsx
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
```

I finally included the subscriptionsUrl: the server's subscriptions endpoint to the Apollo Server object of index.js

```jsx
server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
```

The server listens for subscriptions in the address `ws://localhost:4000/graphql`

#### 8.24 - Implemeting subscriptions on the front end client

For the frontend, I first installed a dependency from apollo link library collection: 

```jsx
npm install subscriptions-transport-ws
```

A WebSocketLink object with the address `ws://localhost:4000/graphql` was then initialized

```jsx
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true
  }
})
```

Since we wouldn't want apollo to use the websocket link for queries and mutations, **split()** method from apollo was used to let us use two different links, depending on the result of a boolean condition.

```jsx
const splitLink = split(
  ({query}) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)
```

This way, **authLink.concat(httpLink)** will be used for queries and mutations. While **wsLink** will be for subscriptions.

I then defined the subscription BOOK_ADDED to the queries.js file. I also took this opportunity to make use of fragments. Thanks to fragments, I didn't need to rewrite repetitive result from queries.

```jsx
const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    genres
    author {
      name
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      ...BookDetails
    }
  } ${BOOK_DETAILS}
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  } ${BOOK_DETAILS}
`
```

Making the App listen subscriptions can be done using the **useSubscription()** hook.

```jsx
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log('subscription data', subscriptionData)
      window.alert(`${subscriptionData.data.bookAdded.title} successfully added`)
    }
  })
```

#### 8.25 - Updating the cache upon addition of a new book

To update the cache upon addition of a new book object, I created a function updateCacheWith(). 

```jsx
  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => { set.map(b => b.id).includes(object.id) }
    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: {
          allBooks: dataInStore.allBooks.concat(addedBook)
        }
      })
    }
  }
```

This function is inserted inside the useSubscription hook's **onSubscriptionData** option, which is triggered each time the useSubscription hook receives data.

```jsx
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      updateCacheWith(addedBook)
    }
  })
```

