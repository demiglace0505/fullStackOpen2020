

## [Part 7 - React router, custom hooks. styling app with CSS and webpack](https://fullstackopen.com/en/part7)
> **Important concepts learned:**
> - React-router
> - Parameterized routing
> - Reusable custom hooks
> - Styling: react-boostrap, material-ui, styled components
> - Webpack: babel transpiler, minification

* [7a React-router](#7a-react-router)
* [7b Custom hooks](#7b-custom-hooks)
* [7c More about styles](#7c-more-about-styles)
* [7d Webpack](#7d-webpack)
* [7e Class components, Miscellaneous](#7e-class-components-miscellaneous)
* [7f Exercises: extending the bloglist](#7f-exercises-extending-the-bloglist)
* [Deploying to Heroku](#deploying-to-heroku)
___

### 7a React-router
> **Tech used**
> BrowserRouter
> Router-Switch-Links
> useRouteMatch()
> useHistory()

React-router is a helpful library for rendering views depending on what's in the URL. In this chapter, I learned to make a navigation bar. The important components discussed in this segment are Switch, BrowserRouter, Route, and Link. Also, parameterized routing using **useParams()** hook and **useRouteMatch()** was given an importance here.

#### 7.1 - Anecdotes - setting up routing
I installed and used react-router-dom's BrowserRouter library (imported as Router) to route ie, to conditionally render components based on the url in the browser, together with Switch and Route.

```jsx
  <Router>
    <div>
      <Link style={padding} to="/">anecdotes</Link>
      <Link style={padding} to="/create">create new</Link>
    </div>
    <Switch>
      <Route path="/create">
        <CreateNew />
      </Route>

      <Route path="/">
        <AnecdoteList anecdotes={anecdotes} />
      </Route>

    </Switch>
  </Router>
```

#### 7.2 - Parameterized Routing - viewing single anecdote
To view a single anecdote page, I used parameterized routing. I first converted each anecdote listing into clickable Link components.

```jsx
  {anecdotes.map(a =>
    <li key={a.id}>
      <Link to={`/anecdotes/${a.id}`}>{a.content}</Link>
    </li>
  )}
```

A component for rendering the view of a single anecdote was made. The anecdote object that will be passed here should be the one according to the clicked Link. To extract the anecdote object with the proper id, **useRouteMatch()** hook was used. I first setup a RouteMatch hook to /anecdotes/:id, and then wrote a statement for finding the anecdote object with the matching id from the url.

```jsx
  const match = useRouteMatch('/anecdotes/:id')
  const anecdote = match
    ? anecdotes.find(a => a.id === Number(match.params.id))
    : null
```
Finally, the parameterized routing to /anecdotes/:id was made. Only the anecdote object with the matching id will be passed to the Anecdote component.

```jsx
  <Switch>
    <Route path="/anecdotes/:id">
      <Anecdote anecdote={anecdote} />
    </Route>
  ...
  </Switch>
```


It is important to note that useRouteMatch() hook doesn't work on components that define the routed part of the application, so the Route component had to be transferred into the renderer in the index.js file.

```jsx
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
)
```

#### 7.3 - Redirecting

To redirect a user upon submission of a new anecdote, I made use of **useHistory()** hook. Using useHistory()'s push method, a user can be redirected to a url.

```jsx
const history = useHistory()
history.push('/')
```

### 7b Custom hooks
> **Tech Used**
> Custom hooks
> Passing props to a component using spread syntax

In this chapter, we created our own custom hooks, for the main purpose of reusing of logic in components. One of the more useful custom hooks created is **useField()**, which can be used for forms.

#### 7.4 - Custom hooks for managing forms
I created my own useField() hook in a separate /hooks directory. This custom hook uses useState() under the hood.

```jsx
export const useField = (name) => {
  const [value, setValue] = useState('')

  const onChange = (e) => {
    setValue(e.target.value)
  }

  return {
    name,
    value,
    onChange
  }
}
```

The significance of this custom hook is so that we can easily reuse it across our form component's inputs. Instead of using separate states for content, author and url, our custom useField hook may be used instead.

```jsx
  const content = useField('content')
  const author = useField('author')
  const info = useField('info')
```

The forms can be further simplified by using spread syntax to pass props into a component, which effectively passes each useField hook's return values: *name, value and onChange*.

```jsx
 <form onSubmit={handleSubmit}>
    <div>
      content
      <input {...content} />
    </div>
    <div>
      author
      <input {...author} />
    </div>
    <div>
      url for more info
      <input {...info} />
    </div>
    <button>create</button>
  </form>
```

#### 7.5 & 7.6 - Custom hook for clearing multiple fields
I added a clear functionality to the custom useField hook.

```jsx
  const clearField = () => {
    setValue('')
  }
```

I assigned individual clears for each input field and created an event handler for our reset button.


```jsx
  const { clearField: clearContent, ...content } = useField('content')
  const { clearField: clearAuthor, ...author } = useField('author')
  const { clearField: clearInfo, ...info } = useField('info')

  const handleReset = () => {
    clearContent()
    clearAuthor()
    clearInfo()
  }
```

Each clearField  was excluded and separated in the spread syntax, because not doing so will introduce errors, as we wouldn't want to pass the clearField attribute to our input element anyways.

#### 7.7 - Custom hooks together with useEffect()
Most of the [code](https://github.com/fullstack-hy2020/country-hook) for this exercise has already been provided. The only changes that were made are in the useEffect portion of the custom useCountry hook. Everytime the variable *name* is updated (pressing submit button), the useEffect hook fires. Axios get is used for retrieving data from the REST Countries API. If there is a match, the country is set and the *found* parameter is set to true.

```jsx
const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    const get = async () => {
      try {
        if (!(name === '')) {
          const res = await axios.get(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`)
          console.log(res.data)
          const data = res.data[0]
          setCountry({ data, found: true })
        }
      } catch (e) {
        console.log(e)
        const data = null
        setCountry({ data, found: false })
      }
    }
    get()
    console.log(country)
  }, [name])

  return country
}
```

#### 7.8 - Custom hooks in the backend
Most of the [code](https://github.com/fullstack-hy2020/ultimate-hooks) for this part has already been provided as well. The goal in this exercise is to reuse the code dealing with communication with the backend into its own useResource custom hook, so that the code that deals with fetching and posting for notes can also be used for fetching and posting for people.

The useResource custom hook makes use of a useState() hook under the hood to contain the response object received from the axios requests. A service for get and post requests was then made, and these are included into a service variable that is then returned into an array together with the resources state.

```jsx
const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  const getAll = async () => {
    const res = await axios.get(baseUrl)
    setResources(res.data)
  }

  const create = async (resource) => {
    const res = await axios.post(baseUrl, resource)
    setResources(resources.concat(res.data))
  }

  const service = {
    create,
    getAll
  }

  return [
    resources, service
  ]
}
```


To use the custom hook, we just need to pass the endpoint (baseUrl) as its parameter.

```jsx
  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')
```

Finally, a useEffect hook in the App component was created to load all db items on startup, and to demonstrate the custom hook.

```jsx
  useEffect(() => {
    noteService.getAll()
    personService.getAll()
  }, [])
```

### 7c More about styles
> **Tech Used**
> react-bootstrap
> material-ui
> styled-components

The final part of [7f Exercises: extending the bloglist](#7f-exercises-extending-the-bloglist) is theming the app. For theming, using material-ui library was my choice. Before starting, I used Material-ui's [CSSBaseline](https://material-ui.com/components/css-baseline/), which effectively removes all margins from the page. 

#### Styling: Log in page
For styling the login page, layout components [Container](https://material-ui.com/components/container/), [Paper](https://material-ui.com/components/paper/) and [Box](https://material-ui.com/components/box/) were used. The Box component supports Material-ui's [Spacing](https://material-ui.com/customization/spacing/) utility out of the box.

```jsx
<Container maxWidth="sm">
      <Paper elevation={3}>
        <Box padding={6}>
```

#### Styling: Nav bar and Notification banner
[AppBar](https://material-ui.com/components/app-bar/) and [Tabs](https://material-ui.com/components/tabs/) component were used for the Top navigation bar. For the notification banner, [Alert](https://material-ui.com/components/alert/) component was used. It is fairly straightforward to implement.

#### Styling: Blog details
The Blog details are contained in a [Card](https://material-ui.com/components/cards/) component. Inside the card, I used [CardHeader](https://material-ui.com/api/card-header/) api, which features the title, author and an [Avatar](https://material-ui.com/api/avatar/) based on the first letter of the author's name.

```jsx
 <CardHeader
    avatar={
      <Avatar>
        {blog.author[0]}
      </Avatar>
    }
    title={blog.title}
    subheader={blog.author}
    action={
      <IconButton
        onClick={() => handleDelete(blog.id, blog.title)}
        style={deleteButtonStyle()}
      >
        <DeleteForeverIcon color="secondary" />
      </IconButton>
    }
  />
```

The CardHeader component also comes with an action subcomponent, which I reprogrammed into a delete icon.

```jsx
 action={
    <IconButton
      onClick={() => handleDelete(blog.id, blog.title)}
      style={deleteButtonStyle()}
    >
      <DeleteForeverIcon color="secondary" />
    </IconButton>
  }
```

For conditional rendering of the delete button, I made use of a function deleteButtonStyle() to return an inline style. This function first checks if the blog has already loaded. It then checks if the current signed in user is the same as the one who added the blog post.

```jsx
  const deleteButtonStyle = () => {
    if (!blog) {
      return {
        display: 'none'
      }
    }
    if (signedinUser.id !== blog.user.id) {
      return {
        display: 'none'
      }
    } 
  }
```

The [CardActions](https://material-ui.com/api/card-actions/) component is the bottom part of the card. Here I used the [Collapse](https://material-ui.com/api/collapse/) api to make a collapsible section for the comments. It uses a useState() hook to determine if the section is collapsed or expanded.

```jsx
const [expanded, setExpanded] = useState(false)
const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  .
  .
  .
  <Collapse in={expanded} timeout="auto" unmountOnExit>
    //
  </Collapse>
```

Also, [clsx library](https://github.com/lukeed/clsx) was used to enable conditional classes. This code snippet is responsible for styling the expand button for the collapse section.

```jsx
<IconButton
  className={clsx({
    ["cardexpandButton"]: !expanded,
    ["cardexpandButtonOpen"]: expanded,
  })}
  onClick={handleExpandClick}
/>
```

### 7d Webpack
> **Tech Used**
>
> Bundling
> Loaders
> Transpilers
> webpack-dev-server
> source-map

One of the most important features of webpack is bundling. In part 3, bundling was performed using **npm run build**. In essence, npm uses webpack to bundle the source code and produce chunks of js files. These chunks are then included and imported into typically the *index.js* file.

Loaders are used to process files such as JSX into proper JavaScript. In the example in the material, babel was used as the loader. For loading css, webpack's [css-loader](https://webpack.js.org/loaders/css-loader/) and [style-loader](https://webpack.js.org/loaders/style-loader/) are needed. For promises and async/await, the [promise-polyfill](https://www.npmjs.com/package/promise-polyfill) can be used.

Transpiling is the process of transforming code from one form (ES6) to another (ES5). Babel is referenced throughout the material as the most popular tool for transpiling. 

Webpack-dev-server was used so that we don't have to rebundle and refresh the browser everytime we change the code.

[Source map](https://webpack.js.org/configuration/devtool/) was used so that we can actually see the source code in error messages. 

Minification is the process of reducing and optimizing the file size of the application by trimming off unnecessary code from the bundle, because it also contains the entire source code for the libraries used. For this purpose, [UglifyJS](http://lisperator.net/uglifyjs/) is used.

### 7e Class components, Miscellaneous
> **Tech Used**
> Class syntax
> Websockets

In using Class components, there are many differences compared to the functional components that were used throughout the material. In functional components, useEffect() hooks are used to fetch data from a server while Class components uses lifecycle-methods such as **componentDidMount**. Another big difference is that in Class components, there is **only one state object**, while in functional components the state can consist of multiple different variables with each having their own update function.

Websockets was briefly discussed. Using websockets api makes it possible to open a two-way communication between the browser and server so that the browser does not need to poll the backend. The primary goal is to reflect the results of changes in the server into the frontend without waiting for the page to reload. 

### 7f Exercises: extending the bloglist


#### 7.9 - Setting up redux and using redux for notifications

First, the frontend was refactored to make use of redux stores. I installed the necessary libraries to the project: redux, redux-devtools-extension, redux-thunk. redux-thunk allows writing of asynchronous actions, which will be very helpful for the notification system. **combineReducers()** from redux library was used because I am expecting and anticipating the use of multiple reducers in the store.

```jsx
const reducers = combineReducers({
  notification: notifReducer,
})

const store = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)
```

For the notifications, I created a notifReducer.js file. This reducer's state will contain the notification message itself, a notification type, and a timeoutID. I created an action dispatcher setNotification(), which dispatches 3 actions asynchronously: first is for setting the notification message, second for refereshing the current notification timeout (to avoid racing) and the last is for removing the notification after 5 seconds.

```jsx
export const setNotification = (notifMessage, notifType) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notifMessage,
      notifType
    })
    let timeoutID = await setTimeout(() => {
      dispatch({
        type: 'REMOVE_NOTIFICATION'
      })
    }, 5000)
    dispatch({
      type: 'REFRESH_TIMEOUT',
      timeoutID
    })
  }
}
```

Using it is very simple with **useDispatch()**.

```jsx
const dispatch = useDispatch()

dispatch(setNotification('message', 'success'))
```

#### 7.10 - Storing blog posts into redux store and creating new blogs

I first created a blogReducer.js file and added two action dispatchers to it: one for loading all blogs, and one for creating a new blog post. I then added blogReducer.js into the combineReducers function.

```jsx
const reducers = combineReducers({
  blogs: blogReducer,
  notification: notifReducer
})
```

It is important to note that I named blogReducer as *blogs*, and it needs to be properly forwarded to our component from the redux store using the useSelector hook.

```jsx
const blogs = useSelector(state => state.blogs)
```

To load blogs on startup, I used useEffect hook

```jsx
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])
```

For creating new blog posts, the BlogForm.js component was refactored. Instead of using redux to manage form states, I feel that it is more intuitive to keep on using controlled forms and to store the state within the form's input component themselves using useState hooks.

Creating blog posts can be done by creating a newBlog object based on the state from the form input fields and pass it as a parameter to the createNewBlog action dispatcher. The new redux-based notification system was also incorporated here.

```jsx
const newBlog = {
  title: newBlogTitle,
  author: newBlogAuthor,
  url: newBlogUrl
}
setnewBlogTitle('')
setnewBlogAuthor('')
setnewBlogUrl('')
dispatch(createNewBlog(newBlog))
dispatch(setNotification(
  `A NEW BLOG ${newBlog.title} by ${newBlog.author} HAS BEEN ADDED`,
  'success'))
```

#### 7.11 - Redux-based blog post delete and like

> Note: the code for this part is included in folder references/7.15

The prior implementation for deleting blog posts relies on useState() hooks.

```jsx
await blogService.deleteBlog(id)
setBlogs(blogs.filter((blog) => blog.id !== id))
```

Refactoring these into using redux brings some advantages. One is the possibility to be able to move the backend related async code into the reducer, thanks to redux-thunk.

```jsx
export const deleteBlog = (id) => {
  return async dispatch => {
    await blogService.deleteBlog(id)
    dispatch({
      type: 'DELETE_BLOG',
      data: id
    })
  }
}
```
The payload is simply the id, which will be used in the reducer function to search for the deleteed blog and remove it from the state.

```jsx
case 'DELETE_BLOG':
  return state.filter((b) => b.id !== action.data)
```

For liking blogs, the first step I did is to create an action dispatcher for liking blog posts.

```jsx
export const likeBlog = (blog) => {
  return async dispatch => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    dispatch({
      type: 'LIKE_BLOG',
      data: blog.id
    })
  }
}
```

Same as the delete action dispatcher, the payload here is also the id of the liked blog. I then used this id to find the index of the liked blog from the redux store's state. Array.map function was then used to increment the liked blog's likes key to reflect the changes made in the backend. This solution is a little convoluted, and another more graceful approach can be used. Instead of finding the index, it is possible to find the blog object itself based on the provided id. This approach is utilized in the **7.18 Adding Comment** exercise.

```jsx
case 'LIKE_BLOG':
  const likedBlogIdx = state.findIndex((b) => b.id === action.data)
  return state.map((b, idx) => {
    if (idx !== likedBlogIdx) {
      return b
    }
    return {
      ...b,
      likes: b.likes + 1
    }
  })
```

#### 7.12 - Saving signed in user credentials to the redux store

To store the information of the signed in user to the Redux store, I created a new reducer signedinUserReducer.js. The state of this store is initially null at startup, and then checks for a logged user in the localStorage using a useEffect() hook. Once it detects an item for a previous logged in user, an action is dispatched that would set the state of the user into the logged user's information such as the user's token, username, and id.

```jsx
  useEffect(() => {
    const signedinUserJSON = window.localStorage.getItem('loggedUser')
    if (signedinUserJSON) {
      const signedinUser = JSON.parse(signedinUserJSON)
      dispatch(setCurrentUser(signedinUser))
      blogService.setToken(signedinUser.token)
    }
  }, [])
```

Likewise, the App component is refactored to use the useSelector() hook to access the signed in user from the redux store instead of accessingdirectly from component state by means of useState hook.

```jsx
const signedinUser = useSelector(state => state.signedinUser)
```

#### 7.13 - Implementing an "all users" view

I first created a redux store for storing all users' information. I then created a service for fetching to /api/users. A corresponding reducer for fetching from this store, usersReducer.js, was also made.

```jsx
export const fetchAllUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch({
      type: 'INIT_USERS',
      payload: users
    })
  }
}
```

I then created a new Users.js component, which will serve as the page for the "all users" view. The users info are retrieved from the store using useSelector() hook, and then array mapped into a table.

```jsx
  const allUsers = useSelector(state => state.users)

  return (
    <div>
      <h1>Users</h1>

      <table>
        <thead>
          <tr>
            <th></th>
            <th><strong>blogs created</strong></th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((u) =>
            <tr key={u.id}>
              <td>
                {u.name}
              </td>
              <td>
                {u.blogs.length}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
```

#### 7.14 - Implementing a "user profile" view

I refactored the Users.js component and renamed it as UsersList.js instead, and inside it I then created a **Users** component, which will be responsible for rendering the link to each individual **User** page. I implemented the linking of pages using react router's Switch-Route.

```jsx
  return (
    <Switch>
      <Route path="/users/:id">
        <User user={user} />
      </Route>
      <Route path="/users/">
        <Users />
      </Route>
    </Switch>
  )
```

The linking to each individual profile is done by array.mapping the users retrieved from the store into react router Link components.

```jsx
  {allUsers.map((u) =>
    <tr key={u.id}>
      <td>
        <Link to={`/users/${u.id}`}>{u.name}</Link>
      </td>
      <td>
        {u.blogs.length}
      </td>
    </tr>
  )}
```

It would also be a great idea to make use of useRouteMatch hooks to view a specific individual user based on the url.

```jsx
  const userMatch = useRouteMatch('/users/:id')

  const user = userMatch
    ? allUsers.find(u => u.id === userMatch.params.id)
    : null
```

#### 7.15 - Viewing a blog post

A massive overhaul of Blog.js was made to implement a separate view fori ndividual blog posts. I created a BlogList.js component that will serve as the router for each individual blog posts. Switch-Route was used to achieve this.

First, the "all blogs" route view was created.

```jsx
<Switch>
  ...
  <Route path='/'>
    <div className="allBlogs">
      {blogs.map((b) =>
        <div className="blogPost" key={b.id}>
          <Link to={`/blogs/${b.id}`}>{b.title} - {b.author}</Link>
        </div>
      )}
    </div>
  </Route>
</Switch>
```

I then refactored Blog.js to use a new layout. The code for handling visibility of delete button has been reused.

```jsx
  const deleteButtonStyle = {
    display:
      signedinUser.id === blog.user.id
        ? ''
        : 'none'
  }

return (
    <div className="blogPost">
      <h1>{blog.title} {blog.author}</h1>
      <Link to={blog.url}>{blog.url}</Link>

      <div className="likesInfo">
        {blog.likes} likes
        <button
          className="likeButton"
          onClick={(event) => handleLike(event)}
        >LIKE</button>
      </div>

      <div>
        added by {blog.author}
      </div>

      <div>
        <button
          className="deleteButton"
          onClick={() => handleDelete(blog.id, blog.title)}
          style={deleteButtonStyle}>DELETE</button>
      </div>
    </div>
```

Finally, useRouteMatch() hooks was used to create parameterized routes. 

```jsx
  const blogMatch = useRouteMatch('/blogs/:id')

  const blog = blogMatch
    ? blogs.find( b => b.id === blogMatch.params.id )
    : null
```

#### 7.16 - Adding a nav bar

A relatively simple and crude Navbar wras added to the app. Although the Navbar component itself was quite simple, a refactor of the other components had to be made.

```jsx
return (
    <div>
      <Link to="/blogs">blogs</Link>
      <Link to="/users">users</Link>
      <span>{signedinUser.name} is logged in</span>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
```

The button for logging out was also transferred and included in the Navbar component. I also made use of useHistory() hooks to redirect the user upon log out.

```jsx
  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    dispatch(logoutCurrentUser())
    history.push('/')
  }
```

The app component's return now looks like this:

```jsx
  <Router>
    <Navbar />
    <NotificationBanner />
    <div>
      {
        signedinUser === null
          ?
          <LoginForm />
          :
          <div>
            <Switch>
              <Route path="/blogs">
                <BlogList />
              </Route>
              <Route path="/users">
                <UsersList />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
      }
    </div>
  </Router>
```

#### 7.17 - Implementing functionality for displaying comments in blog posts

To implement the comments functionality, the backend will have to be updated. First, the Blog model's schema was updated to include a comments array.

```jsx
const blogSchema = mongoose.Schema({
  ...
  comments:[{
    type: String
  }]
})
```

I also added an endpoint for post requests to blogs/:id/comments in the bloglist.js controller.

```jsx
bloglistRouter.post('/:id/comments', async (req,res) => {
  const decodedToken = jwt.verify(req.token, config.LOGINTOKEN)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const blog = await Blog.findById(req.params.id)
  if (blog) {
    blog.comments = blog.comments.concat(req.body.content)
    const saved = await blog.save()
    res.status(200).json(saved.toJSON())
  } else {
    return res.status(404).json({
      error: 'blog not found'
    })
  }
})
```

For now, the only way to add comments is by directly making a POST request. To test, a POST request was made using VS REST Client.

```jsx
POST http://localhost:3001/api/blogs/5f60271ab98caa132887669f/comments
Content-Type: application/json
Authorization: bearer //REDACTED-TOKEN

{
  "content": "test comment"
}
```

Displaying the comments in the frontend is very simple. I just created a new CommentList.js component and passed the blog's comments array into it. Then, using array.map, each comment was mapped into individual \<li>'s

#### 7.18 - Adding comments from the frontend

A react component CommentBox inside CommentList.js was added. This component contains the form with the text box and button for adding a new comment. I first created a service in blogs.js for making axios post requests to the backend. It is important to note that the comment received by this service should be enclosed in an object (commentObj) before sending it via axios to the backend.

```jsx
const addComment = async (id, comment) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const commentObj= {
    content: comment
  }
  const res = await axios.post(`${baseUrl}/${id}/comments`, commentObj, config)
  return res.data
}
```

The action dispatcher is then added

```jsx
export const comment = (blog, comment) => {
  return async dispatch => {
    const returnedBlog = await blogService.addComment(blog.id, comment)
    dispatch({
      type: 'ADD_COMMENT',
      id: blog.id,
      data: returnedBlog.comments
    })
  }
}
```

and the corresponding case is made to update the redux store state

```jsx
case 'ADD_COMMENT':
  const blogToUpdate = state.find((b) => b.id === action.id)
  const updatedBlog = {
    ...blogToUpdate,
    comments: action.data
  }
  return state.map((b) => 
    b.id === action.id ? updatedBlog : b
  )
```
#### Deploying to Heroku

The first step is to create a Procfile at the backend's root directory that tells Heroku how to start the application.

```
web: npm start
```

We also need to create a production build of the frontend using

```
npm run build
```

We then copy the resulting build folder to the root of our backend, and then add express [static](http://expressjs.com/en/starter/static-files.html) middleware to our backend

```jsx
app.use(express.static('build'))
```

Next is to create a git repository and make sure to gitignore node_modules and .env

```
git init
```

We can now create a git remote using

```
heroku create
```

or the following command if a heroku remote has already been created. *nameless-plains-30535* is the random generated name by heroku for the app.

```
heroku git:remote -a nameless-plains-30535
```

Finally, we can now add, commit and push

```
git add .
git commit -m "commit to heroku"
git push heroku master
```

We now need configure heroku to use our MONGODB_URI and LOGINTOKEN environment variables, since dotenv will no longer work in production.

```
heroku config:set MONGODB_URI=mongodb+srv://<username>:<pass>@cluster0-hp62y.mongodb.net/blog-list?retryWrites=true
heroku config:set LOGINTOKEN=<token>
```

Finally, we now need to activate the dynos for this app.

```
heroku ps:scale web=1
```

To view logs, we can run this command in the backend's directory

```
heroku logs --tail
```

