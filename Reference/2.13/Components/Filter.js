import React from 'react'

const Filter = ( {handleFilter} ) => {
    return (
        <div>
            find countries <input onChange={handleFilter} />
        </div>
    )
}

export default Filter