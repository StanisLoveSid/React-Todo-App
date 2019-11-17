import axios from 'axios'

export const fetchProjectsRequest = () => dispatch => {
  fetch(`http://localhost:3001/projects.json`, { credentials: 'include' }).then(response => {
    return response.json();
  })
  .then(data => { 
    dispatch(projectsRequestSuccess(data))
  })
  .catch(error => console.log(error))
}

const projectsRequestSuccess = projectsArray => ({
  type: 'FETCH_PROJECTS',
  payload: projectsArray
})
