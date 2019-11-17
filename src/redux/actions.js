import axios from 'axios'

export const fetchProjectsRequest = () => dispatch => {
  return axios.get(`http://localhost:3001/projects`, { withCredentials: true })
  .then(response => { 
    dispatch(projectsRequestSuccess(response.data))
  })
  .catch(error => console.log(error))
}

const projectsRequestSuccess = projectsArray => ({
  type: 'FETCH_PROJECTS',
  payload: projectsArray
})
