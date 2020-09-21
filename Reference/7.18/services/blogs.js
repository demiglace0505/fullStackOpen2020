import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
  // console.log('token', token)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const res = await axios.put(`${baseUrl}/${id}`, newObject)
  return res.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  return axios.delete(`${baseUrl}/${id}`, config)
}

const addComment = async (id, comment) => {
  // console.log('blogService',id, comment)
  const config = {
    headers: {
      Authorization: token
    }
  }
  const commentObj= {
    content: comment
  }
  const res = await axios.post(`${baseUrl}/${id}/comments`, commentObj, config)
  // console.log('service', res)
  return res.data
}

export default { getAll, create, setToken, update, deleteBlog, addComment }