import React from 'react'
import { useSelector } from 'react-redux'
import {
  Switch, Route, Link,
  useRouteMatch
} from 'react-router-dom'

const UsersList = () => {
  const allUsers = useSelector(state => state.users)

  const userMatch = useRouteMatch('/users/:id')
  // console.log('userMatch*', userMatch)

  const user = userMatch
    ? allUsers.find(u => u.id === userMatch.params.id)
    : null

  // console.log('allUsers:', allUsers)
  // console.log('user:', user)
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
}

const Users = () => {
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
                <Link to={`/users/${u.id}`}>{u.name}</Link>
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
}

const User = ({ user }) => {
  // console.log(user)
  if (!user) {
    return (
      <div>loading...</div>
    )
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>
      <ul>
        {user.blogs.map((b) =>
          <li key={b.id}>{b.title}</li>
        )}
      </ul>
    </div>
  )
}


export default UsersList