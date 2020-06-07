import React from 'react'

const Persons = ( {persons} ) => {
    return (
        <div>
            {persons.map((person) => <Person name={person.name} key={person.name} number={person.number} />)}
        </div>
    )
}

const Person = ({ name, number }) => {
    return (
        <div>
            {name} {number}
        </div>
    )
}

export default Persons