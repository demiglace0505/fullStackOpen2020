import React, { useState } from 'react';
import ReactDOM from 'react-dom';


const App = () => {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);
   
    const handleGood = () => {
        return () => {
            setGood(good + 1)
        }
    }

    const handleNeutral = () => {
        return () => {
            setNeutral(neutral + 1)
        }
    }

    const handleBad = () => {
        return () => {
            setBad(bad + 1);
        }
    }

    return (
        <div>
            <h1>Give Feedback</h1>

            <button onClick={handleGood()}>good</button>
            <button onClick={handleNeutral()}>neutral</button>
            <button onClick={handleBad()}>bad</button>

            <h1>statistics</h1>
            <div>good {good}</div>
            <div>neutral {neutral}</div>
            <div>bad {bad}</div>
        
        </div>
    )

}


ReactDOM.render(<App />, document.getElementById('root'))