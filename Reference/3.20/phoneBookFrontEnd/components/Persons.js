import React from 'react'

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

const Person = ({ name, number, deletePerson }) => {
    return (
        <div>
            {name} {number} <button onClick={deletePerson}>delete</button>
        </div>
    )
}

export default Persons