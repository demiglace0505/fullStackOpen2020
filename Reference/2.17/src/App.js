import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Persons from './components/Persons.js'
import PersonForm from './components/PersonForm.js'
import Filter from './components/Filter.js'
import personService from './services/persons.js'


const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [nameFilter, setNewNameFilter] = useState('')

    useEffect(() => {
        personService.getAll()
            .then((allPersons) => {
                // console.log(response);
                setPersons(allPersons)
            })
    }, [])

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
            number: newNumber
        }
        personService.create(newPerson)
            .then((createdPerson) => {
                setPersons(persons.concat(createdPerson))
                setNewName('')
                setNewNumber('')
            })
    }

    const deletePersonWithID = (id, name) => {
        if (window.confirm(`delete ${name}?`)) {
            personService.deletePerson(id)
            // axios.delete(`http://localhost:3001/persons/${id}`)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id))
                    console.log(`deleted ${name} id: ${id}`);
                })
        }
        else {
            console.log('Cancelled delete');
        }
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
            <Persons persons={personsToShow} deletePersonWithID={deletePersonWithID} />

        </div>
    )
}

export default App