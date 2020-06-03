import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Button = ({ text, handleClick }) => {
    return (
        <span>
            <button onClick={handleClick}>{text}</button>
        </span>
    )
}

const Statistic = ({ text, value }) => {
    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    )
}

const Statistics = (props) => {

    if (props.good === 0 && props.neutral === 0 && props.bad === 0) {
        return (
            <div>
                <h1>statistics</h1>
                <div>No feedback given</div>
            </div>
        )
    }

    return (
        <div>
            <h1>statistics</h1>
            <table>
                <tbody>
                    <Statistic text="good" value={props.good} />
                    <Statistic text="neutral" value={props.neutral} />
                    <Statistic text="bad" value={props.bad} />
                    <Statistic text="all" value={props.total} />
                    <Statistic text="average" value={props.average} />
                    <Statistic text="positive" value={props.percent} />
                </tbody>
            </table>
        </div>
    )
}

const App = () => {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);
    const total = good + neutral + bad;
    const average = (good - bad) / total;
    const percent = good / total * 100 + " %";

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

            <Button handleClick={handleGood()} text="good" />
            <Button handleClick={handleNeutral()} text="neutral" />
            <Button handleClick={handleBad()} text="bad" />

            <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} percent={percent} />

        </div>
    )

}


ReactDOM.render(<App />, document.getElementById('root'))