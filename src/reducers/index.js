import { combineReducers } from 'redux'

const entitiesInitState = {
  todos: {},
  comments: {},
  tasks: {}
}

export function entities(state = entitiesInitState, action) {
  switch (action.type) {
    case 'FETCH_PROJECTS':
    //   debugger
      return {...state, todos: action.payload}
    default:
      return state;
  }
}

export const mainReducer = combineReducers({ entities });
