import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog.js'


describe('Blog post tests', () => {
  const blog = {
    title: "test",
    author: "lain",
    url: "lain.xyz",
    likes: 5,
    user: '123'
  }

  const mockfn = jest.fn()
  const currUser = {
    username: 'lain',
    password: 'pass123',
    id: '123'
  }

  let component

  beforeEach(() => {
    component = render(
      <Blog
        blog={blog} currUser={currUser} handleDelete={mockfn}
      />
    )
  })

  // 5.13
  test('renders title and author, but not the url or number of likes at startup', () => {
    const basicDiv = component.container.querySelector('.basicInfo')
    // console.log(prettyDOM(basicDiv))
    expect(basicDiv).not.toHaveStyle('display: none')

    const expandedDiv = component.container.querySelector('.expandedInfo')
    // console.log(prettyDOM(expandedDiv))
    expect(expandedDiv).toHaveStyle('display: none')
  })

  // 5.14
  test('url and number of likes are shown when blog view button is clicked', () => {
    const button = component.getByText('view')
    // console.log(prettyDOM(button))
    fireEvent.click(button)

    const expandedDiv = component.container.querySelector('.expandedInfo')
    // console.log(prettyDOM(expandedDiv))
    expect(expandedDiv).not.toHaveStyle('display: none')
  })

})