import React, { useState } from 'react'
import Persons from './components/Persons.js'
import PersonForm from './components/PersonForm.js'
import Filter from './components/Filter.js'


const App = ( {personsList} ) => {
    const [persons, setPersons] = useState(personsList)
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [nameFilter, setNewNameFilter] = useState('')

    const personsToShow = nameFilter === ''
        ? persons
        : persons.filter((person) => person.name.toLowerCase().includes(nameFilter.toLowerCase()) === true)

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
            <Filter handleFilter={handleFilter} />

            <h3>add a new</h3>
            <PersonForm
                newName={newName}
                newNumber={newNumber}
                handleNewName={handleNewName}
                handleNewNumber={handleNewNumber}
                addPerson={addPerson}
            />

            <h3>Numbers</h3>
            <Persons persons={personsToShow} />

        </div>
    )
}

export default App