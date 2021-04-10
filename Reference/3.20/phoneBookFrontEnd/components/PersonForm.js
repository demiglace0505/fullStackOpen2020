import React from 'react'

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

export default PersonForm