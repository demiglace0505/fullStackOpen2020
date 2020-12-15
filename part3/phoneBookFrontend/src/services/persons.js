import axios from 'axios'

// const baseUrl = 'http://localhost:3001/persons' //for json-server
const baseUrl = '/api/persons'

const getAll = () => {
  const req = axios.get(baseUrl)
  return req.then((response) => response.data)
}

const create = ( newPerson ) => {
  const req = axios.post(baseUrl, newPerson)
  return req.then((response) => response.data)
}

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

const updateNumber = (id, update) => {
  const req = axios.put(`${baseUrl}/${id}`, update)
  return req.then( (response) => response.data )
}

export default {
  getAll,
  create,
  deletePerson,
  updateNumber
}