import React from 'react'
import { useSelector } from 'react-redux'


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
}


export default Users