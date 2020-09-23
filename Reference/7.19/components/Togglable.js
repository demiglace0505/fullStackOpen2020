import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  Button,
  Box
} from '@material-ui/core'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hiddenWhenVisible = { display: visible ? 'none' : '' }
  const shownWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <Box py={3}>
      <div style={hiddenWhenVisible}>
        <Button variant="contained"
          color="primary"
          onClick={toggleVisibility}
        >
          {props.openLabel}
        </Button>
      </div>

      <div style={shownWhenVisible}>
        {props.children}
        <Button variant="contained"
          color="secondary"
          onClick={toggleVisibility}
        >
          {props.closeLabel}
        </Button>
      </div>
    </Box>

  )
}

Togglable.propTypes = {
  openLabel: PropTypes.string.isRequired,
  closeLabel: PropTypes.string.isRequired
}

export default Togglable