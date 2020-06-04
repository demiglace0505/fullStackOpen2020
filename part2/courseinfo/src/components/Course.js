import React from 'react'

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
            {/* <Content parts={course.parts} /> */}
        </div>
    )
}

const Course = ({ courses }) => {
    // console.log('courses', courses);
    return (
        <div>
            {courses.map((course) => {
                return (
                    <div key={course.id}>
                        <Header course={course} />
                        <Content parts={course.parts} />
                    </div>
                )
            }
            )}
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


export default Course