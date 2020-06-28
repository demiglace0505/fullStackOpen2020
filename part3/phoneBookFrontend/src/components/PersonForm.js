import React from 'react'
import PropTypes from 'prop-types'

const PersonForm = (
  {
    newName,
    newNumber,
    handleNewName,
    handleNewNumber,
    addPerson
  }
) => {
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input
            value={newName}
            onChange={handleNewName}
          />
        </div>

        <div>
          number: <input
            value={newNumber}
            onChange={handleNewNumber}
          />
        </div>


        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}
PersonForm.propTypes = {
  newName: PropTypes.string,
  newNumber: PropTypes.string,
  handleNewName: PropTypes.func,
  handleNewNumber: PropTypes.func,
  addPerson: PropTypes.func
}

export default PersonForm