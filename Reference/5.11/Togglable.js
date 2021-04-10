import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hiddenWhenVisible = { display: visible ? 'none' : '' }
  const shownWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hiddenWhenVisible}>
        <button onClick={toggleVisibility}>{props.openLabel}</button>
      </div>

      <div style={shownWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>{props.closeLabel}</button>
      </div>
    </div>

  )
}

Togglable.propTypes = {
  openLabel: PropTypes.string.isRequired,
  closeLabel: PropTypes.string.isRequired
}

export default Togglable