import React from 'react'
import ReactDOM from 'react-dom'

const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.part} {props.number}</p>
    </div>
  )
}

const Content = (props) => {
  console.log(props)
  return (
    <div>
      <Part part={props.parts[0].name} number={props.parts[0].exercises} />
      <Part part={props.parts[1].name} number={props.parts[1].exercises} />
      <Part part={props.parts[2].name} number={props.parts[2].exercises} />
    </div>
  )
}

const Total = ( props ) => {
  return (
    <div>
      <p>Number of Exercises {props.total}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts = {parts} />
      <Total total={parts[0].exercises + parts[1].exercises + parts[2].exercises} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))