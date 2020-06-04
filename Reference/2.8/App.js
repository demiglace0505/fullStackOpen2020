import React, { useState } from 'react'

const Person = ({ name, number }) => {
    return (
        <div>
            {name} {number}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([
        {
            name: 'Arto Hellas',
            number: '040-1234567',
        }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const handleNewName = (event) => {
        setNewName(event.target.value)
    }

    const handleNewNumber = (event) => {
        setNewNumber(event.target.value)
    }

    const addPerson = (event) => {
        event.preventDefault()

        // check duplicate
        if (persons.some((person) => person.name === newName)) {
            alert(`${newName} is already added to phonebook`);
            setNewName('')
            setNewNumber('')
            return;
        }

        const newPerson = {
            name: newName,
            id: newName,
            number: newNumber
        }
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
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
                    number: <input
                        value={newNumber}
                        onChange={handleNewNumber}
                    />
                </div>


                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>

            {persons.map((person) => <Person name={person.name} key={person.name} number={person.number} />)}

            {/* <div>debug (newName): {newName}</div> */}

        </div>
    )
}

export default App