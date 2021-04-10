
## [Part 6 - State Management with Redux](https://fullstackopen.com/en/part6)
> **Important concepts learned:**
> - Flux and Redux architecture
> - Action creator functions
> - Redux dev tools and extension
> - Combining reducers
> - Redux middlewares and thunk
> - connect, mapStateToProps, mapDispatchToProps


* [6a Flux-architecture and Redux](#6a-flux-architecture-and-redux)
* [6b Many reducers](#6b-many-reducers)
* [6c Communicating with server in a redux application](#6c-communicating-with-server-in-a-redux-application)
* [6d connect](#6d-connect)
___

### 6a Flux-architecture and Redux
> **Tech used**
> Redux store
> deepfreeze
> action dispatchers and action creators

In this chapter, Flux architecture was introduced. There are three parts in Flux: the dispatcher, store and the view. Whenever an action changes state of the store, the view is re-rendered. The main focus of this part is using hook-based api, such as **useSelector()** and **useDispatch()**, of the react-redux library.

#### 6.1 - Unicafe - setting up and reducers
I cloned the unicafe sample app from [this repo](https://github.com/fullstack-hy2020/unicafe-redux). I then modified the state of the app using this code:

```jsx
const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GOOD':
      const newState = {
        ...state,
        good: state.good + 1
      }
      //...
```

Deepfreeze library was also installed and used in our test suites to ensure that our reducer function is indeed an immutable function.

#### 6.2 - Unicafe - increment, decrement and zeroing

We created dispatchers for BAD, NEUTRAL, and ZERO actions and attached them to their respective buttons. Using the store's **getState()** method, we can display a parameter of our state.

#### 6.3 - Anecdotes app - setting up and saving votes to a redux-store

An event handler for voting was created. This event handler dispatches a voteAnecdote() action.


```jsx
 const vote = (id) => {
    console.log('vote', id)
    dispatch(voteAnecdote(id))
  }
```

The corresponding voteAnecdote() function which receives the id of the anecdote to be voted was made as well.

```jsx
export const voteAnecdote = (id) => {
  return {
    type: 'VOTE',
    data: { id }
  }
}
```

Finally, the corresponding action type of 'VOTE' was made in our reducer function.

```jsx
case 'VOTE':
  const id = action.data.id
  const anecdoteToVote = state.find(a => a.id === id)
  const updatedAnecdote = {
    ...anecdoteToVote,
    votes: anecdoteToVote.votes + 1
  }
  return state.map(anecdote => 
      anecdote.id !== id ? anecdote : updatedAnecdote
    )
```

#### 6.4 - Adding of new anecdotes
First we created a form for new anecdotes

```jsx
 <form onSubmit={addAnecdote}>
    <div><input name="anecdote" /></div>
    <button type="submit">create</button>
  </form>
```

We then created an event handler for adding new notes


```jsx
 const addAnecdote = (event) => {
    event.preventDefault()
    // console.log(event.target)
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
  }
```

Its corresponding action, createAnecdote(), which receives the anecdote's content:

```jsx
export const createAnecdote = (content) => {
  return {
    type: 'NEW_ANECDOTE',
    data: {
      content,
      id: getId(),
      votes: 0
    }
  }
}
```

And finally, a case for addition of new anecdotes.


```jsx
   case 'NEW_ANECDOTE':
      return [...state, action.data]
```

#### 6.5 - Sorting according to votes
To sort the anecdotes, array sort method was used

```jsx
const sortedAnecdotes = anecdotes.sort((a,b) => b.votes - a.votes)
```

#### 6.6 - Refactoring into action creator functions

Action creator functions are functions that create actions.

```jsx
export const voteAnecdote = (id) => {
  return {
    type: 'VOTE',
    data: { id }
  }
}

export const createAnecdote = (content) => {
  return {
    type: 'NEW_ANECDOTE',
    data: {
      content,
      id: getId(),
      votes: 0
    }
  }
}
```
#### 6.7 - Separating the form for creating a new anecdote

A new component AnecdoteForm.js was created. This component contains the form and related logic for creating a new anecdote.

#### 6.8 - Separating rendering into own component

The logic for rendering the list of anecdotes was separated into its own component called AnecdoteList.js. The logic related to voting for an anecdote were transferred to this component as well.

### 6b Many reducers
> **Tech used**
> Redux dev-tools extension
> combineReducers()

In this segment, **combineReducers()** was given the focus. This is useful because as the app grows bigger, it'll be better to split our reducers into separate functions, with each managing a different state. Also, redux devtools extension proved to be useful in debugging.

#### 6.9 - Using redux dev-tools and creating a separate store.js file
Redux dev-tools and browser extension were installed.

```jsx
npm install --save-dev redux-devtools-extension
```

I created a separate store.js file and inside it I created a store using redux's createStore and imported it to our index.js file.

```jsx
import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import anecdoteReducer from './reducers/anecdoteReducer.js'

const store = createStore(anecdoteReducer, composeWithDevTools())

export default store
```

#### 6.10 - Rendering notifications
We created a new reducer and action creator in our notificationReducer.js file.

```jsx
const notificationReducer = (state = 'hello', action) => {
  switch (action.type) {
    case 'NOTIFY':
      return action.notifMessage
    default:
      return state
  }
}

export const notificationChange = (notifMessage) => {
  return {
    type: 'NOTIFY',
    notifMessage
  }
}
```
We then made use of **combineReducers()** to make use of multiple reducers in our app.

```jsx
const reducers = combineReducers({
  anecdotes: anecdoteReducer,
  notification: notificationReducer
})

const store = createStore(reducers, composeWithDevTools())
```
Due to these changes, we needed to modify some lines from our AnecdoteList.js and Notification.js file since our state now has this structure:

```jsx
{
    anecdotes: [...],
    notification: ''
}
```
For AnecdoteList.js:

```jsx
const anecdotes = useSelector(state => state.anecdotes)
```

And for Notification.js:

```jsx
const notification = useSelector(state => state.notification)
```
For now, we rendered our notification banner in a crude way

```jsx
store.dispatch(notificationChange('Test notification'))
```

#### 6.11 - Notification timeout
In order to remove notifications, a new removeNotification action and a matching case was added to our notificationReducer.js.

```jsx
const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'REMOVE_NOTIFICATION':
      return null

export const removeNotification = () => {
  return {
    type: 'REMOVE_NOTIFICATION'
  }
}
```

We then created a conditional rendering for our Notification.js component

```jsx
 const notification = useSelector(state => state.notification)

  if (!notification) {
    return null
  } else {
    return (
      <div style={style}>
        {notification}
      </div>
    )
  }
```

Finally, we hooked up our setNotification to our vote function.

```jsx
  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    dispatch(setNotification(anecdote.content))
    setTimeout(()=> {
      dispatch(removeNotification())
    }, 5000)
  }
```


#### 6.12 - Filtering anecdotes
We created a new reducer called filterReducer and an accompanying filterChange action.

```jsx
const filterReducer = ( state='', action ) => {
  switch(action.type) {
    case 'SET_FILTER':
      return action.filter
    default:
      return state
  }
}

export const filterChange = (filterText) => {
  return {
    type: 'SET_FILTER',
    filter: filterText
  }
}
```
A new react component Filter.js was made to serve as the UI.

```jsx
const Filter = () => {
  const dispatch = useDispatch()
  const handleChange = (event) => {
    dispatch(filterChange(event.target.value))
  }

  return (
    <div>
      filter <input onChange={handleChange} />
    </div>
  )
}
```
And the logic for conditional rendering of filtered items was implemented in AnecdoteList.js

```jsx
  const anecdoteFilter = useSelector(state => state.filter)

  const anecdotesToShow = anecdoteFilter === ''
    ? anecdotes
    : anecdotes.filter((a) => a.content.includes(anecdoteFilter))

  const sortedAnecdotes = anecdotesToShow.sort((a, b) => b.votes - a.votes)
```


### 6c Communicating with server in a redux application
> **New tech learned:**
> Redux-thunk
> Asynchronous action creators

In this chapter, the focus is communicating with the backend server. A way of initializing the state on startup was also shown. Using **redux-thunk** library, we can make asynchronous actions.

#### 6.13 - Fetching of anecdotes on startup

We first initialized our db by installing json-server and creating an offline db.json file. We then created a service /services/anecdotes.js for our axios requests.

```jsx
const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}
```
A reducer and a matching action creator for initializing our anecdotes was made

```jsx
    case 'INIT_ANECDOTES':
      return action.data
.
.
.
export const initializeAnecdotes = (anecdotes) => {
  return {
    type: 'INIT_ANECDOTES',
    data: anecdotes
  }
}
```

To initialize on startup, we made use of **useEffect()** hooks in our App.js component

```jsx
 const dispatch = useDispatch()
  useEffect(() => {
    anecdoteService.getAll().then(a => {
      dispatch(initializeAnecdotes(a))
    })
  }, [dispatch])
```

#### 6.14 - Creating new anecdotes
We created a service for axios post requests

```jsx
const createNew = async (content) => {
  const obj = {
    content,
    votes: 0
  }
  const res = await axios.post(baseUrl, obj)
  return res.data
}
```

We modified our addAnecdote function from our AnecdoteForm.js component.

```jsx
  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
```
Since our service's createNew function returns an object, we needed to modify our createAnecdote action creator. Instead of passing only the content and generating the data from the creator itself, we directly passed the object (data) returned by createNew service.

```jsx
export const createAnecdote = (data) => {
  return {
    type: 'NEW_ANECDOTE',
    data
  }
}
```
#### 6.15 - Asynchronous action creators using redux-thunk
Installed redux-thunk library, a redux middleware that allows us to write asynchronous action creators. We need to initialize it along with the initialization of our store.

```jsx
const store = createStore(reducers, composeWithDevTools(
  applyMiddleware(thunk)
))
```

We then refactor the initializeAnecdotes() action creator from our anecdoteReducer.js to include asynchronous functions using async await.

```jsx
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    })
  }
}
```

Thanks to these, we are able to move away the back-end related code from our App component. It is now simplified into:

```jsx
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
      dispatch(initializeAnecdotes())
  }, [dispatch])
```

#### 6.16 - Creating new anecdotes - asynchronous
The action creator for creating new anecdotes was modified to be asynchronous as well.

```jsx
export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }
}
```

This simplifies the addAnecdote() method from our AnecdoteForm component to

```jsx
  const addAnecdote = async (event) => {
    event.preventDefault()
    // console.log(event.target)
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
  }
```

#### 6.17 - Saving votes to backend
We first needed to create an axios service for PUT requests

```jsx
const update = async(id, newObj) => {
  const res = await axios.put(`${baseUrl}/${id}`, newObj)
  return res.data
}
```
We then needed to modify our AnecdoteList.js file. Instead of passing only the id to the voteAnecdote action, we instead passed the whole anecdote object instead.

```jsx
dispatch(voteAnecdote(anecdote))
```

Our voteAnecdote action creator was then converted to an asynchronous action creator. We also added the ability to save to the backend using the axios update() service we created.

```jsx
export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const newObj = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const votedAnecdote = await anecdoteService.update(anecdote.id, newObj)
    dispatch({
      type: 'VOTE',
      data: votedAnecdote
    })
  }
}
```

#### 6.18 - Asynchronous notifications
We created an asynchronous action creator that dispatches both SET_NOTIFICATION and REMOVE_NOTIFICATION actions.

```jsx
export const setNotification = (message, duration) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        message,
        duration
      }
    })
    await setTimeout(() => {
      dispatch({
        type: 'REMOVE_NOTIFICATION'
      })
    }, duration * 1000)
  }
}
```
With this, we no longer have to use setTimeout() when calling our addAnecdote() and vote() event handlers.

```jsx
dispatch(setNotification(`You voted '${anecdote.content}'`, 3))
```

### 6d connect
> **New tech learned:**
> connect
> mapStateToProps
> mapDispatchToProps

 Before hook-based api's such as useDispatch() and useSelector(), there was the older connect function for redux. 

#### 6.19 - Accessing store's state using connect

The current implementation uses hook-api **useSelector()** and **useDispatch()** from react-redux. The older way to share redux store to components is by using **connect()** function. We also made use of **mapStateToProps** to map our store state into our component props.

```jsx
const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    filter: state.filter
  }
}

export default connect(mapStateToProps)(AnecdoteList)
```

We then have to refactor our AnecdoteList.js to access state using props

```jsx
  const anecdotesToShow = props.filter === ''
    ? props.anecdotes
    : props.anecdotes.filter((a) => a.content.includes(props.filter))
```

#### 6.20 - Using mapDispatchToProps

We modified our Filter.js component to use mapDispatchToProps instead of useDispatch. Since the Filter component doesn't need to access state, we declared *null* as the first parameter for **connect()**.

```jsx
const mapDispatchToProps = {
  filterChange
}

export default connect(
  null,
  mapDispatchToProps
)(Filter)
```

Finally, we can access our action creators via props.

```jsx
const Filter = (props) => {
  const handleChange = (event) => {
    props.filterChange(event.target.value)
  }
```

There is also an alternative and more complex way of using mapDispatchToProps. These are done in our AnecdoteForm.js component.

```jsx
const mapDispatchToProps = dispatch => {
  return {
    createAnecdote: value => {
      dispatch(createAnecdote(value))
    },
    setNotification: setNotification
  }
}

export default connect(
  null,
  mapDispatchToProps
)(AnecdoteForm)
```

Likewise, we are now able to access createAnecdote and setNotification actions using props.

```jsx
const addAnecdote = async (event) => {
	...
	props.createAnecdote(content)
    props.setNotification(`New anecdote '${content}' created`, 10)
}
```

While we are at it, we also fixed AnecdoteList's vote functionality that broke due to changes in 6.19. For this, we used the simple way of mapping dispatch to props.

```jsx
export default connect(
  mapStateToProps,
  { voteAnecdote, setNotification }
)(AnecdoteList)
```

#### 6.21 - Fixing Notification Banner timeout bug
To fix the "racing" notification bug wherein the last notification banner disappears preemptively when multiple instances of notification banners are created. A big refactor of notificationReducer.js was made. The state of the notification store now consists of two variables: *message* and *timeoutID*.

```jsx
const notificationReducer = (
  state = { message: null, timeoutID: null },
  action
) => {
...
}
```

We then made use of timeoutID to identify notification banners and created a new action for setting this timeoutID to the current notification instance.

```jsx
let timeoutID = await setTimeout(() => {
      dispatch({
        type: 'REMOVE_NOTIFICATION'
      })
    }, duration * 1000)
    dispatch({ type: 'SET_TIMEOUTID', timeoutID })
```

We created a corresponding case for the new SET_TIMEOUTID action:

```jsx
case 'SET_TIMEOUTID':
  return { ...state, timeoutID: action.timeoutID }
```

Due to these changes, we need to alter the conditional rendering logic of our Notification.js component a bit. We need to now check for the value of *notification.message* instead of *notification* alone, since notification now comes with timeoutID as well.

```jsx
 if (!notification.message) {
    return null
  } else {
    return (
      <div style={style}>
        {notification.message}
      </div>
    )
  }
```

For some reason, notifications for new anecdotes stopped working, so we had to revert to the shorthand method of using mapDispatchToProps in our AnedoteForm.js file.

```jsx
export default connect(
  null,
  {createAnecdote,setNotification}
)(AnecdoteForm)
```
