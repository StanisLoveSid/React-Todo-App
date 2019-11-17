import { combineReducers } from 'redux'

const entitiesInitState = {
  todos: {},
  comments: {},
  tasks: {}
}

export function entities(state = entitiesInitState, action) {
  switch (action.type) {
    case 'FETCH_PROJECTS':
      console.log('here we are')
      return {...state, ...action.payload.entities}
    default:
      return state;
  }
}

export const mainReducer = combineReducers({ entities });
