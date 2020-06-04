import React, { useState } from 'react'

const Person = ( {name} ) => {
    return(
        <div>
            {name}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas' }
    ])
    const [newName, setNewName] = useState('')

    const handleNewName = (event) => {
        setNewName(event.target.value)
    }

    const addPerson = (event) => {
        event.preventDefault()
        const newPerson = {
            name: newName,
            id: newName
        }
        setPersons(persons.concat(newPerson))
        setNewName('')
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <form onSubmit={addPerson}>
                <div>
                    name: <input
                        value={newName}
                        onChange={handleNewName}
                    />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            
            {persons.map( (person) => <Person name={person.name} key={person.name} /> )}

            {/* <div>debug (newName): {newName}</div> */}

        </div>
    )
}

export default App