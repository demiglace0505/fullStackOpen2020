import React from 'react'
import PropTypes from 'prop-types'

const Persons = ({ persons, deletePersonWithID }) => {
  return (
    <div>
      {persons.map((person) => <Person name={person.name}
        key={person.name}
        number={person.number}
        deletePerson={() => deletePersonWithID(person.id, person.name)}
      />)}
    </div>
  )
}

Persons.propTypes = {
  persons: PropTypes.array,
  deletePersonWithID: PropTypes.func
}


const Person = ({ name, number, deletePerson }) => {
  return (
    <div>
      {name} {number} <button onClick={deletePerson}>delete</button>
    </div>
  )
}

Person.propTypes = {
  name: PropTypes.string,
  number: PropTypes.string,
  deletePerson: PropTypes.func
}

export default Persons