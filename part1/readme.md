## [Part 1 - Introduction to React](https://fullstackopen.com/en/part1)

> **Important concepts learned**
>
> - npm
>
>
> - create-react-app
>
>
> - props for passing data to components
>
>
> - useState hooks
>
>
> - conditional rendering

* [1a Introduction to React](#introduction-to-react)
* [1b Javascript](#1b-javascript)
* [1c Component state, event handlers](#1c-component-state-event-handlers)
* [1d A more complex state, debugging React apps](#1d-a-more-complex-state-debugging-react-apps)

### 1a: Introduction to React

> **Tech used:**
>
> create-react-app
>
> passing props into components

#### 1.1 - Refactoring into components

In this part, the basics of React was discussed. I created my first react app using `npx create-react-app`. Creating and using React Components was the main focus in this part. Instead of having one big App component, the components are split into Header, Content and Total

```jsx
<Header course={course} />
<Content part1={part1} part2={part2} part3={part3} exercises1={exercises1} exercises2={exercises2} exercises3={exercises3}/>
<Total total={exercises1 + exercises2 + exercises3} />
```

 Passing data to components was made possible using **props**. 

```jsx
const Content = (props) => {
  return (
    <div>
      <p>{props.part1} {props.exercises1}</p>
      <p>{props.part2} {props.exercises2}</p>
      <p>{props.part3} {props.exercises3}</p>
    </div>
  )
}
```

#### 1.2 - Refactoring into more components

A new component called Part was made, which is responsible for rendering the course part. Instead of having the Content component render everything by itself, those are rendered by the Part component.

```jsx
const Part = (props) => {
  return (
    <div>
      <p>{props.part} {props.number}</p>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part part={props.part1} number={props.exercises1} />
      <Part part={props.part2} number={props.exercises2} />
      <Part part={props.part3} number={props.exercises3} />
    </div>
  )
}
```



### 1b: Javascript
#### 1.3 - Using Javascript objects

The variable definitions for the dummy data were changed into javascript objects.

```jsx
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }
```

 The application has to be refactored to make it work with the new data set.

```jsx
const Content = (props) => {
  console.log(props)
  return (
    <div>
      <Part part={props.part1.name} number={props.part1.exercises} />
      <Part part={props.part2.name} number={props.part2.exercises} />
      <Part part={props.part3.name} number={props.part3.exercises} />
    </div>
  )
}
```

#### 1.4 - Objects in an array

The dummy data was modified again and is now enclosed in an array

```jsx
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
```

Since the material doesn't encourage the use of loops yet, the data are extracted manually using their array indices.

```jsx
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
```

#### 1.5 - Single Javascript object

This time around, the courses are inside a single javascript object. There are two keys: name which is a string, and parts, which is an array.

```jsx
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
```



### 1c: Component state, event handlers
> **Tech used:**
> useState hook

We made use and defined component helper functions: functions that are called when the component is rendered. These are commonly defined within a function itself. Destructuring props was tackled as well. 

**Component state** was added to our application components using React's state hook: 

```jsx
const [count, setCount] = useState(0)
```

A change in state would cause the component to re-render.

We also made use of **Event Handlers** which are functions that are called when a specific event occurs, such as button presses. 

### 1d: A more complex state, debugging React apps
> **Tech used:**
> useState hook, debugger, function that returns a function

We can also make use of arrays as state. 

```jsx
const [count, setCount] = useState({left: 0, right:0})
```

It was discussed that mutating state directly in React is *forbidden*. Also, it was mentioned that the useState function should not be called from within a loop, conditional or any place that is not a function defining a component. It should only be called form the inside of a function body that defines a React component.

Chrome's debugger was introduced in this part. By adding the debugger command to our code, we can make the execution of the code pause.

Another way to define an event handler that was introduced to us is by using a function that returns a function:

```jsx
const hello = (who) => {
    return = () => console.log('hello', who)
}
<button onClick ={hello('WORLD')}></button>
```
This enables the function to accept a parameter (WORLD).