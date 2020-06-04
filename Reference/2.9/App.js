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
        { name: 'Arto Hellas', number: '040-123456' },
        { name: 'Ada Lovelace', number: '39-44-5323523' },
        { name: 'Dan Abramov', number: '12-43-234345' },
        { name: 'Mary Poppendieck', number: '39-23-6423122' }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [nameFilter, setNewNameFilter] = useState('')

    const personsToShow = nameFilter === ''
        ? persons
        : persons.filter( (person) => person.name.toLowerCase().includes(nameFilter.toLowerCase()) === true )

    const handleNewName = (event) => {
        setNewName(event.target.value)
    }

    const handleNewNumber = (event) => {
        setNewNumber(event.target.value)
    }

    const handleFilter = (event) => {
        setNewNameFilter(event.target.value)
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
            <div>
                filter shown with <input
                    onChange={handleFilter}
                />
            </div>


            <h3>add a new</h3>
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

            <h3>Numbers</h3>
            {personsToShow.map((person) => <Person name={person.name} key={person.name} number={person.number} />)}


        </div>
    )
}

export default App