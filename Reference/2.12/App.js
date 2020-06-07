import React, { useEffect, useState } from 'react'
import axios from 'axios'

import Countries from './Components/Countries.js'

const App = () => {
    const [countries, setCountries] = useState([])
    const [countrySearch, setNewCountrySearch] = useState('')
    const handleFilter = (event) => {
        setNewCountrySearch(event.target.value)
    }

    const countriesToShow = countrySearch === ''
        ? countries
        : countries.filter(
            (country) => country.name.toLowerCase().includes(countrySearch.toLowerCase()) === true
        )

    useEffect(() => {
        axios.get('https://restcountries.eu/rest/v2/all').then(
            (response) => {
                console.log(response.data)
                setCountries(response.data)
            }
        )
    }, [])


    return (
        <div>
            find countries <input onChange={handleFilter} />

            <Countries countries={countriesToShow} allCountries={countries} />
        </div>
    )
}

export default App