import React from 'react'
import Course from './Course.js'

const App = ({ courses }) => {
    
    return (
        <div>
            <h1>Web development curriculum</h1>
            <Course courses={courses}/>
        </div>
    )
}

export default App