import React from 'react'
import ReactDOM from 'react-dom'

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  // console.log(parts);
  return (
    <div>
      {parts.map((part) =>
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      )}
    </div>
  )
}

const Header = ({ course }) => {
  // console.log(course);
  return (
    <div>
      <h1>{course.name}</h1>
      <Content parts={course.parts} />
    </div>
  )
}

const Course = ({ course }) => {
  // console.log('course', course);
  return (
    <div>
      <Header course={course} />
    </div>
  )
}

const Total = ( {total} ) => {
  return (
    <div>
      <strong>total of {total} exercises</strong>
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ],
  }
  const total = course.parts.reduce( (acc, next) => {
    return acc + next.exercises
  }, 0)

  return (
    <div>
      <Course course={course} />
      <Total total={total}/>
    </div>
  )

}

ReactDOM.render(<App />, document.getElementById('root'))