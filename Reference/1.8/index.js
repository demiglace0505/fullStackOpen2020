import React, { useState } from 'react';
import ReactDOM from 'react-dom';


const Statistics = (props) => {
    return (
        <div>
            <h1>statistics</h1>
            <div>good {props.good}</div>
            <div>neutral {props.neutral}</div>
            <div>bad {props.bad}</div>
            <div>all {props.total}</div>
            <div>average {props.average}</div>
            <div>positive {props.percent}%</div>
        </div>
    )
}

const App = () => {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);
    const total = good + neutral + bad;
    const average = (good - bad) / total;
    const percent = good / total * 100;

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

            <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} percent={percent} />

        </div>
    )

}


ReactDOM.render(<App />, document.getElementById('root'))