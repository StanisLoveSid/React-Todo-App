import { combineReducers } from 'redux'

const entitiesInitState = {
  todos: {},
  comments: {},
  tasks: {}
}

export function entities(state = entitiesInitState, action) {
  switch (action.type) {
    case 'FETCH_PROJECTS':
      return {...state, todos: action.payload}
    case 'CREATE_PROJECT_SUCCESS':
      const newArray = [... state.todos, action.payload];
      return {...state, todos: newArray}
    case 'DELETE_PROJECT_SUCCESS':
      const idx = state.todos.findIndex((el) => el.id === action.payload);
      const newDeletedArray = [... state.todos.slice(0,idx), ... state.todos.slice(idx + 1)];
      return {...state, todos: newDeletedArray}
    case 'UPDATE_PROJECT_SUCCESS':
      const idxEdit = state.todos.findIndex((el) => el.id === action.payload.projectId);
      const oldItem = state.todos[idxEdit];
      const newItem = { ... oldItem, title: action.payload.title}
      const newEditedArray = [... state.todos.slice(0,idxEdit), newItem, ... state.todos.slice(idxEdit + 1)];
      return {...state, todos: newEditedArray}
    case 'FETCH_TASKS':
      return {...state, tasks: action.payload} 
    case 'CREATE_TASK_SUCCESS':
      const newTasksArray = [... state.tasks, action.payload];
      return {...state, tasks: newTasksArray}
    case 'UPDATE_TASK_SUCCESS':
      const idxTask = state.tasks.findIndex((el) => el.id === action.payload.id);
      const newEditedTasksArray = [... state.tasks.slice(0,idxTask), action.payload, ... state.tasks.slice(idxTask + 1)]
      return {...state, tasks: newEditedTasksArray}
    case 'DELETE_TASK_SUCCESS':
      const idxDelete = state.tasks.findIndex((el) => el.id === action.payload);
      const newDeletedTasksArray = [... state.tasks.slice(0,idxDelete), ... state.tasks.slice(idxDelete + 1)];
      return {...state, tasks: newDeletedTasksArray}
    default:
      return state;
  }
}

export const mainReducer = combineReducers({ entities });
