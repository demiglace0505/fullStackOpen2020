import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
    const [weatherDetails, setWeatherDetails] = useState(null)

    useEffect(() => {
        axios.get('http://api.weatherstack.com/current', {
            params: {
                access_key: process.env.REACT_APP_WEATHER_KEY,
                query: capital
            }
        }).then(
            (response) => {
                setWeatherDetails(response.data)
            }
        )
    }, [capital])
    // console.log('weather', weatherDetails);

    if (weatherDetails) {
        return (
            <WeatherWidget weather={weatherDetails} />
        )
    } else {
        return (
            <div>
                Loading Weather...
            </div>
        )
    }

}

const WeatherWidget = ({ weather }) => {

    return (
        <div>
            <h3>Weather in {weather.location.name}</h3>
            <strong>temperature:</strong> {weather.current.temperature} Celsius
            <br />
            <strong>wind:</strong> {weather.current.wind_speed} mph direction {weather.current.wind_dir}
            <br />
            <img src={weather.current.weather_icons[0]}
                alt={weather.current.weather_descriptions}
                style={{ width: "60px" }} />
        </div>
    )
}

export default Weather