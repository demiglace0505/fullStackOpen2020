
## [Part 5 - Testing React Apps](https://fullstackopen.com/en/part5)
> **Important concepts learned:**
> - Saving user state to a state variable
> - Using browser's localStorage to store logged user's token
> - Using inline css-styling to control element visibility
> - props.children
> - enforcing prop types
> - front end testing using jest and react-testing-library
> - End to end testing using Cypress
> - Creating custom Cypress commands


* [5a Login in frontend](#5a-login-in-frontend)
* [5b props.children and proptypes](#5b-props.children-and-proptypes)
* [5c Testing React apps](#5c-testing-react-apps)
* [5d End to end testing](#5d-end-to-end-testing)
___

### 5a Login in frontend
> **Tech used**
> localStorage setItem() and getItem() and removeItem()

In this part, the frontend for logging in is implemented. Storing the user's login information in the local storage is also tackled. The focus on this part is retrieving the token from the local storage and adding it to requests.

#### 5.1 - Creating a login form
I created a new react component called LoginForm to display a username and password field and I also created a corresponding login service for sending requests to /api/login.

```jsx
const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}
```
I used **useState** hooks to save the information of the current user to a state `user`

```jsx
const [user, setUser] = useState(null)
```
I finally made an event handler handleLogin() for logging in.

```jsx
  const user = await loginService.login({
    username, password
  })
  setUser(user)
  setUsername('')
  setPassword('')
```

#### 5.2 - Saving token to browser's local storage
I created a setToken() function for our blogService module, which prepends the user's token with the keyword bearer. This is necessary because our backend code relies on the user's token.

```jsx
const setToken = (newToken) => {
  token = `bearer ${newToken}`
}
```

This token can be included to our blogservice.create's axios post requests header by using it as a third parameter in our post method.

```jsx
  const config = {
    headers: { Authorization: token}
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
```

To make our current logged in user persist on reload,  we made use of the **localStorage.setItem()** method.

```jsx
window.localStorage.setItem('loggedUser', JSON.stringify(user))
```
To make our app check for a logged in user on startup, we used effect hooks and **localStorage.getItem()**.

```jsx
useEffect (() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])
```
We can also delete this item, essentially logging out our user using **localStorage.removeItem()**


```jsx
const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }
```

#### 5.3 - Allowing logged in users to add blogs
We created a BlogForm component to display the interface for creating a new blog. We also made a handleCreateBlog() event handler for this. Also, we made sure to add `blogService.setToken(user.token)` on various places such as after logging in and on startup to ensure that the token is properly set.
#### 5.4 - Creating a notification banner
I used useState hooks: one for the notification message and one for controlling notification type.

```jsx
const [notifMessage, setnotifMessage] = useState(null)
const [notifType, setnotifType] = useState(null)
```
I created a new React component NotificationBanner which is responsible for rendering the notification. It has notifMessage and notifType as its props, and I also added basic styling to our index.css file.

```jsx
  if (notifMessage === null) {
    return null
  }
  if (notifType === 'success') {
    return (
      <div className="notifSuccess">{notifMessage}</div>
    )
  }
  if (notifType === 'error') {
    return (
      <div className="notifError">{notifMessage}</div>
    )
  }
```


### 5b props.children and proptypes
> **Tech Used**
> {props.children}
> prop-types

In this part, I learned about child components: a React component inside another React component. I also learned about enforcing prop-types. ESLint was added to the frontend as well.

#### 5.5 - Using togglable component to render
A new react component called Togglable was created. This would be a reusable component that would be responsible for managing visibility of forms.

```jsx
const Togglable = (props) => {
  const [visible, setVisible] = useState(false)
  const hiddenWhenVisible = { display: visible ? 'none' : '' }
  const shownWhenVisible = { display: visible ? '' : 'none' }
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  return (
    <div>
      <div style={hiddenWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={shownWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}
```

We simply pass the element or component we wish to be hidden as a child of Togglable. It can be rendered using **{props.children}**.

```jsx
<Togglable buttonLabel='login'>
  <BlogForm
    ...
  />
</Togglable>
```
#### 5.6 - Refactoring and moving state to components
The App and BlogForm components were refactored. The states that are related to creating new blog posts were moved to the BlogForm component, instead of being in the App component. Also, we created a `createBlog()` event handler in our BlogForm component to handle form submissions.


```jsx
   event.preventDefault()
    console.log('sending:', newBlogTitle, newBlogAuthor, newBlogUrl)
    addBlog({
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl
    })
    setnewBlogTitle('')
    setnewBlogAuthor('')
    setnewBlogUrl('')
```
It calls the `addBlog()` function from our main App component and passes the new blog information to it.

#### 5.7 - Adding a view/hide button to each blog
State was added to the Blog component to control the visibility of each blog details, similar to a drop down button.

```jsx
 const [expanded, setExpanded] = useState(false)
  const expandedInfoVisible = { display: expanded ? '' : 'none' }
```

We use `expandedInfoVisible`as a css style to those that we wish to hide.

```jsx
<div  style={expandedInfoVisible}>
```

#### 5.8 - Adding a like button
A put request was created in our blog service.

```jsx
const update = async (id, newObject) => {
  const req = await axios.put(`${baseUrl}/${id}`, newObject)
  return req.data
}
```
We then created a `handleLike()` event handler for our like button


```jsx
 const updatedBlog = { ...blog, likes: likes + 1}
    await blogService.update(updatedBlog.id, updatedBlog)
    setlikes(likes + 1)
```

#### 5.9 - Sorting the blogs according to number of likes
We created a `sortBlogs()` function that would be called in a useEffect() hook to sort the blogs on startup.

```jsx
const sortBlogs = (blogs) => {
    blogs.sort((a,b) => b.likes - a.likes)
  }
useEffect(() => {
  blogService.getAll().then(blogs => {
    sortBlogs(blogs)
    setBlogs(blogs)
  })
}, [])
```
#### 5.10 - Only render delete button for blogs of logged in user
We first created a handleDelete() function in our App component. This function takes the blog's id and title as its parameter.

The logic for checking if the delete button should be rendered was written in the Blog component.

```jsx
  const deleteButton = { display: currUser.id === blog.user.id ? '' : 'none' }
```

We used this as a style for our delete button. This delete button also calls an event handler for deleting the blog post, and we pass the blog post's id and title to it.

```jsx
<button onClick={() => handleDelete(blog.id, blog.title)} style={deleteButton}>DELETE</button>
```

We then added the delete request to our blogService component.  

```jsx
const config = {
    headers: { Authorization: token }
  }
  return axios.delete(`${baseUrl}/${id}`, config)
```

#### 5.11 - Defining proptypes
We installed prop-types

```jsx
npm install --save prop-types
```

And used it to enforce the types of our props

```jsx
Togglable.propTypes = {
  openLabel: PropTypes.string.isRequired,
  closeLabel: PropTypes.string.isRequired
}
```

#### 5.12 - eslint
We added eslint and configured our .eslintrc.js file

### 5c Testing React apps
> **Tech Used**
> React and jest-dom testing library
> prettyDOM()
> fireEvent()
> Mock functions

For testing React apps, Jest comes in default. Another testing library that the material recommends is the react-testing-library. 

#### 5.13 - Testing for conditional rendering
We first installed react and jest-dom testing libraries

```jsx
npm install --save-dev @testing-library/react @testing-librrary/jest-dom
```

To easily identify objects and make our testing easier, we added classes `basicInfo` and `expandedInfo` on some of our divs in the Blog.js component.

We used react library's **render()** method to render the component to be tested.

```jsx
  beforeEach(() => {
    component = render(
      <Blog
        blog={blog} currUser={currUser} handleDelete={mockfn}
      />
    )
  })
```
The **container** property of the rendered object contains the html. We can also print a component's html to the console using the component's built-in **debug()** method. We can also selectively print a part of the component using **prettyDOM()** method from @testing-library/dom.

```jsx
const  basicDiv  =  component.container.querySelector('.basicInfo')
```

#### 5.14 - Firing events
We can simulate a click using the **fireEvent()** method.

```jsx
const button = component.getByText('view')
fireEvent.click(button)
```

#### 5.15 - Calling mock functions
We can pass a mock event handler to our events. We assign this mock handler to a button, and we can check how many times the mock handler has been called.

```jsx
const mockHandler = jest.fn()
expect(mockHandler.mock.calls).toHaveLength(1)
```

#### 5.16 - Testing creating new blogs
We added ids to our BlogFOrm.js component's input fields to make it easier to select them. We used **fireEvent.change()** to add text values to an input field and **fireEvent.submit()** to submit the form.


```jsx
 const component = render(
    <BlogForm
      addBlog={addBlog}
    />
  )
const titleInput = component.container.querySelector('#title')
fireEvent.change(titleInput, {
  target: { value: 'test title' }
})
expect(addBlog.mock.calls[0][0].title).toBe('test title')
```

### 5d End to end testing
> **Tech Used**
> Cypress
> Cypress command chaining

In this chapter, end to end test was the focus. Essentially, we are testing the system as a whole. Cypress library was used. Cypress is similar to jest in that it uses describe blocks, and similar to mocha with its english-like methods. I also learned to make use of Cypress css selectors, which is #.

I also installed the eslint-plugin-cypress library as a development dependency.

It is also possible to bypass the login during testing by making direct POST requests to the proper endpoint. I also learned to make Cypress commands, which are at /cypress/support/commands.js

#### 5.17 - Configuring Cypress
We installed cypress on the frontend and created a new script to run cypress:

```jsx
"cypress:open": "cypress open"
```

We also created a script in our backend to run with node env var as NODE_ENV=test

```jsx
"start:test": "cross-env NODE_ENV=test node index.js"
```

We then set up a new router that will be used for resetting the database during testing.

```jsx
router.post = ('/reset', async (req, res) => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  res.status(204).end()
})
```
We only want to use this router during testing, so we added this conditional in our app.js

```jsx
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing.js')
  app.use('/api/testing', testingRouter)
}
```

#### 5.18 - Testing log in
We first created a testUser in our beforeEach() function

```jsx
const testUser = {
  name: 'lain TEST',
  username: 'lain',
  password: 'lainPass123'
}
cy.request('POST', 'http://localhost:3001/api/users', testUser)
```

We can use cy's **get()** command and selectors to select an element. We then made use of **type()** and **click()** commands to simulate input. For asserting, we used **contain()** to check if a specific string of text is present in the document. We also used cypress command chaining to run multiple commands on one component.

```jsx
it('fails with wrong credentials', function () {
  cy.get('#username-input').type('lain')
  cy.get('#password-input').type('WRONG PASS')
  cy.get('#login-button').click()

  cy.get('.notifError').should('contain','wrong username or password')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
```

#### 5.19 - Testing creating new blog
We created a Cypress custom command for logging in that we can reuse. Instead of having Cypress type the user's username and password during login, we instead bypassed the UI and made direct POST requests to /api/login.

```jsx
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then((res) => {
    localStorage.setItem('loggedUser', JSON.stringify(res.body))
    cy.visit('http://localhost:3000')
  })
})
```

#### 5.20 - Test for liking a blog
We created a custom command for creating blog posts.

```jsx
Cypress.Commands.add('createBlog', ({ title, author, url, likes }) => {
  cy.request({
    url: 'http://localhost:3001/api/blogs',
    method: 'POST',
    body: {
      title, author, url, likes
    },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedUser')).token}`
    }
  })
  cy.visit('http://localhost:3000')
})
```
We also used cypress **as()** command to assign an alias to an element to easily reference it later on.

```jsx
 cy.get('.blogPost')
    .contains('test blog for liking').parent().as('targetBlog')
    .contains('view')
    .click()

  cy.get('@targetBlog')
    .contains('like')
    .click()

  cy.get('@targetBlog')
    .get('.likesInfo')
    .should('contain', 'likes: 6')
```



#### 5.21 - Testing blog deletion
We created a test for verifying a blog delete operation. Additionally, we completed an optional task of making sure that other logged users cannot delete blog posts that aren't their own.

```jsx
cy.get('@targetBlog')
  .get('.deleteButton')
  .should('have.css', 'display', 'none')
```

#### 5.22 - Test that blog posts are ordered according to number of likes
We used cy **wrap()** command to enable us to perform assertions on DOM elements. Using class selector `.blogPost`, we were able to **get()** all elements of a class and we then individually checked if each blog post is ordered properly.

```jsx
cy.get('.blogPost').then(
          (blogs) => {
            cy.wrap(blogs[0]).should('contain', 'TOP BLOG')
            cy.wrap(blogs[1]).should('contain', '2nd top BLOG')
            cy.wrap(blogs[2]).should('contain', '3rd BLOG')
            cy.wrap(blogs[3]).should('contain', '_4th BLOG')
            cy.wrap(blogs[4]).should('contain', 'a 5th BLOG')
            cy.wrap(blogs[5]).should('contain', 'final and sixth bloog')
          }
        )
```
