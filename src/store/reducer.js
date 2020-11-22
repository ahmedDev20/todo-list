import { combineReducers } from '@reduxjs/toolkit';
import entitiesReducer from './entities';
import authReducer from './auth';

export default combineReducers({
  entities: entitiesReducer,
  auth: authReducer,
});
