import React from 'react'
import Weather from './Weather.js'

const Countries = ({ countries, allCountries, handleShowButton }) => {
    if (countries.length === allCountries.length) {
        return (
            <div>
                Enter a filter
            </div>
        )
    } else if (countries.length > 10) {
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )
    } else if (countries.length === 1) {
        const country = countries[0]
        return (
            <CountryDetails country={country} />
        )
    } else {
        return (
            <div>
                {countries.map(
                    (country) => <Country
                        name={country.name}
                        key={country.alpha3Code}
                        handleShowButton={handleShowButton}
                    />)}
            </div>
        )
    }
}

const Country = ({ name, handleShowButton }) => {
    return (
        <div>
            {name} <button onClick={handleShowButton} >show</button>
        </div>
    )
}

const Language = ({ name }) => {
    return (
        <li>
            {name}
        </li>
    )
}

const CountryDetails = ({ country }) => {


    return (
        <div>
            <h2>{country.name}</h2>
            <div>capital {country.capital}</div>
            <div>population {country.population}</div>
            <h3>Languages</h3>
            <ul>
                {country.languages.map((lang) => <Language name={lang.name} key={lang.iso639_2} />)}
            </ul>
            <img src={country.flag}
                alt={country.name}
                style={{ width: "100px" }} />

            <Weather capital={country.capital} />
        </div>
    )
}

export default Countries