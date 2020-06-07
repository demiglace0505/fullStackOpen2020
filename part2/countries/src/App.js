import React, { useEffect, useState } from 'react'
import axios from 'axios'

import Countries from './Components/Countries.js'
import Filter from './Components/Filter.js'

const App = () => {
    const [countries, setCountries] = useState([])
    const [countrySearch, setCountrySearch] = useState('')

    const handleFilter = (event) => {
        setCountrySearch(event.target.value)
    }

    const handleShowButton = (event) => {
        // console.log(event.target.parentElement.firstChild.data)
        setCountrySearch(event.target.parentElement.firstChild.data)
    }

    const countriesToShow = countrySearch === ''
        ? countries
        : countries.filter(
            (country) => country.name.toLowerCase().includes(countrySearch.toLowerCase()) === true
        )

    useEffect(() => {
        axios.get('https://restcountries.eu/rest/v2/all').then(
            (response) => {
                // console.log(response.data)
                setCountries(response.data)
            }
        )
    }, [])
    // console.log(countries);
    

    return (
        <div>
            <Filter handleFilter={handleFilter} />
            <Countries countries={countriesToShow} allCountries={countries} handleShowButton={handleShowButton} />
        </div>
    )
}

export default App