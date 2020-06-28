import React, { useState, useEffect } from 'react'

import NotificationBanner from './components/NotificationBanner.js'
import Persons from './components/Persons.js'
import PersonForm from './components/PersonForm.js'
import Filter from './components/Filter.js'
import personService from './services/persons.js'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNewNameFilter] = useState('')
  const [notifMessage, setNotifMessage] = useState(null)
  const [notifType, setNotifType] = useState(null) // success or error

  useEffect(() => {
    personService.getAll()
      .then((allPersons) => {
        // console.log(response);
        setPersons(allPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    // check duplicate
    if (persons.some((person) => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find((person) => person.name === newName)
        const newEntry = {
          name: personToUpdate.name,
          number: newNumber
        }

        personService.updateNumber(personToUpdate.id, newEntry)
          .then((udpatedPerson) => {
            setPersons(persons.map((person) => person.id !== personToUpdate.id
              ? person
              : udpatedPerson
            ))
            setNewName('')
            setNewNumber('')
            setNotifType('success')
            setNotifMessage(
              `Updated ${personToUpdate.name}`
            )
            setTimeout(() => {
              setNotifMessage(null)
              setNotifType(null)
            }, 5000)
          })
          .catch((err) => {
            console.log(err.response.data)

            setNotifType('error')
            setNotifMessage(
              `${err.response.data.error}`
            )
            setTimeout(() => {
              setNotifMessage(null)
              setNotifType(null)
            }, 5000)
          })

        // cancel number update
      } else {
        console.log('cancel')
      }

      // Brand new entry
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personService.create(newPerson)
        .then((createdPerson) => {
          setPersons(persons.concat(createdPerson))
          setNewName('')
          setNewNumber('')
          setNotifType('success')
          setNotifMessage(
            `Added ${newPerson.name}`
          )
          setTimeout(() => {
            setNotifMessage(null)
            setNotifType(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error.response.data)
          setNotifType('error')
          setNotifMessage(`${error.response.data.error}`)
          setTimeout(() => {
            setNotifMessage(null)
            setNotifType(null)
          }, 5000)
        })

    }

  }

  const deletePersonWithID = (id, name) => {
    if (window.confirm(`delete ${name}?`)) {
      personService.deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          // console.log(`deleted ${name} id: ${id}`);
        })
        .catch((err) => {
          console.log(err)

          setNotifType('error')
          setNotifMessage(
            `Information of ${name} has already been removed from server`
          )
          setTimeout(() => {
            setNotifMessage(null)
            setNotifType(null)
          }, 5000)
        })
    }
    else {
      console.log('Cancelled delete')
    }
  }

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

  return (
    <div>
      <h2>Phonebook</h2>
      <NotificationBanner message={notifMessage} notifType={notifType} />
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