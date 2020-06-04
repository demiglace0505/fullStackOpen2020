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
  const total = parts.reduce((acc, next) => {
    return acc + next.exercises
  }, 0)

  return (
    <div>
      {parts.map((part) =>
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      )}
      <Total total={total} />
    </div>
  )
}

const Header = ({ course }) => {
  // console.log(course);
  return (
    <div>
      <h2>{course.name}</h2>
      <Content parts={course.parts} />
    </div>
  )
}

const Course = ({ courses }) => {
  // console.log('courses', courses);
  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map((course) => <Header course={course} key={course.id} />)}
    </div>
  )
}

const Total = ({ total }) => {
  return (
    <div>
      <strong>total of {total} exercises</strong>
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
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
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]


  return (
    <div>
      <Course courses={courses} />

    </div>
  )

}

ReactDOM.render(<App />, document.getElementById('root'))