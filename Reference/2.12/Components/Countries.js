import React from 'react'

const Countries = ({ countries, allCountries }) => {
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
            <div>
                <h2>{country.name}</h2>
                <div>capital {country.capital}</div>
                <div>population {country.population}</div>
                <h3>languages</h3>
                <ul>
                    {country.languages.map((lang) => <Language name={lang.name} key={lang.iso639_2} />)}
                </ul>
                <img src={country.flag} alt="flag" style={{width:"100px"}} />
            </div>
        )
    } else {
        return (
            <div>
                {countries.map((country) => <Country name={country.name} key={country.alpha3Code} />)}
            </div>
        )
    }

}

const Country = ({ name }) => {
    return (
        <div>
            {name}
        </div>
    )
}

const Language = ( {name} ) => {
    return (
        <li>
            {name}
        </li>
    )
}

export default Countries