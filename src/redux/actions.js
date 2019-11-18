import axios from 'axios'

export const fetchProjectsRequest = () => dispatch => {
  return axios.get(`http://localhost:3001/projects`, { withCredentials: true })
  .then(response => { 
    dispatch(projectsRequestSuccess(response.data))
  })
  .catch(error => console.log(error))
}

export const createProjectRequest = (title, userId) => dispatch => {
  const fd = new FormData();
  fd.append('title', title)
  fd.append('user_id', userId)
  return axios.post('http://localhost:3001/projects', fd)
  .then(response => {
    dispatch(projectCreateRequestSuccess(response.data))
  })
  .catch(error => console.log(error))
}

export const removeProjectRequest = (projectId) => dispatch => {
  return axios.delete(`http://localhost:3001/projects/${projectId}`)
  .then(response => {
    dispatch(projectDeleteRequestSuccess(projectId))
  })
  .catch(error => console.log(error))
}

export const updateProjectRequest = (title, projectId) => dispatch => {
  const fd = new FormData();
  fd.append('title', title)
  return axios.put(`http://localhost:3001/projects/${projectId}`, fd)
  .then(response => {
    dispatch(projectUpdateRequestSuccess(title, projectId))
  })
  .catch(error => console.log(error))
}

export const createTaskRequest = (id, label, startDate) => dispatch => {
  const fd = new FormData();
  fd.append('title', label);
  fd.append('project_id', id);
  fd.append('deadline', startDate);
  return axios.post('http://localhost:3001/tasks', fd)
  .then(response => {
    dispatch(taskCreateRequestSuccess(response.data))
  })
  .catch(error => console.log(error))
}

export const updateTaskRequest = (title, startDate, id) => dispatch => {
  const fd = new FormData();
  fd.append('title', title);
  fd.append('deadline', startDate);
  return axios.put(`http://localhost:3001/tasks/${id}`, fd)
  .then(response => {
    dispatch(taskUpdateRequestSuccess(response.data))
  })
  .catch(error => console.log(error))
}

export const removeTaskRequest = (taskId) => dispatch => {
  return axios.delete(`http://localhost:3001/tasks/${taskId}`)
  .then(response => {
    dispatch(taskDeleteRequestSuccess(taskId))
  })
  .catch(error => console.log(error))
}

const projectCreateRequestSuccess = project => ({
  type: 'CREATE_PROJECT_SUCCESS',
  payload: project
})

const projectsRequestSuccess = projectsArray => ({
  type: 'FETCH_PROJECTS',
  payload: projectsArray
})

const projectDeleteRequestSuccess = projectId => ({
  type: 'DELETE_PROJECT_SUCCESS',
  payload: projectId
})

const projectUpdateRequestSuccess = (title, projectId) => ({
  type: 'UPDATE_PROJECT_SUCCESS',
  payload: { title: title, projectId: projectId }
})

export const fetchTasks = (tasks) => ({
  type: 'FETCH_TASKS',
  payload: tasks
})

const taskCreateRequestSuccess = task => ({
  type: 'CREATE_TASK_SUCCESS',
  payload: task
})

const taskUpdateRequestSuccess = (task) => ({
  type: 'UPDATE_TASK_SUCCESS',
  payload: task
})

const taskDeleteRequestSuccess = taskId => ({
  type: 'DELETE_TASK_SUCCESS',
  payload: taskId
})
