import { combineReducers } from '@reduxjs/toolkit';
import todosReducer from './todos';

export default combineReducers({
  todos: todosReducer,
});
