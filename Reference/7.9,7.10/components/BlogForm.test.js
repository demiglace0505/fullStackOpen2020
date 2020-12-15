import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import BlogForm from './BlogForm.js'


// 5.16
test('form calls the event handler as props with the right details', () => {
  const addBlog = jest.fn()

  const component = render(
    <BlogForm
      addBlog={addBlog}
    />
  )
  const form = component.container.querySelector('form')
  const titleInput = component.container.querySelector('#title')
  const authorInput = component.container.querySelector('#author')
  const urlInput = component.container.querySelector('#url')

  fireEvent.change(titleInput, {
    target: { value: 'test title' }
  })
  fireEvent.change(authorInput, {
    target: { value: 'test author' }
  })
  fireEvent.change(urlInput, {
    target: { value: 'test url.com' }
  })
  fireEvent.submit(form)

  expect(addBlog.mock.calls).toHaveLength(1)
  // console.log(addBlog.mock.calls)
  expect(addBlog.mock.calls[0][0].title).toBe('test title')
  expect(addBlog.mock.calls[0][0].author).toBe('test author')
  expect(addBlog.mock.calls[0][0].url).toBe('test url.com')
})