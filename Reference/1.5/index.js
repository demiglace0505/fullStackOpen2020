import React from 'react'
import ReactDOM from 'react-dom'

const Header = (props) => {
  console.log('Header props', props)
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
  )
}

const Part = (props) => {
  console.log('Part props', props)
  return (
    <div>
      <p>{props.part} {props.number}</p>
    </div>
  )
}

const Content = (props) => {
  console.log('Content props', props)
  return (
    <div>
      <Part part={props.parts[0].name} number={props.parts[0].exercises} />
      <Part part={props.parts[1].name} number={props.parts[1].exercises} />
      <Part part={props.parts[2].name} number={props.parts[2].exercises} />
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>Number of Exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
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
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))