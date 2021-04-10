import React from 'react'
import { useDispatch, connect } from 'react-redux'
import { filterChange } from '../reducers/filterReducer.js'

const Filter = (props) => {
  // const dispatch = useDispatch()
  const handleChange = (event) => {
    props.filterChange(event.target.value)
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

const mapDispatchToProps = {
  filterChange
}

export default connect(
  null,
  mapDispatchToProps
)(Filter)