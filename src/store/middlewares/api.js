import axios from 'axios';
import * as actions from '../api';

require('dotenv').config()

const api = ({ getState, dispatch }) => next => async action => {
  if (action.type !== actions.apiCallBegan.type) return next(action);

  const { url, method, data, onStart, onSuccess, onError } = action.payload;

  if (onStart) dispatch({ type: onStart });

  next(action);

  try {
    const response = await axios.request({
      baseURL: process.env.REACT_APP_API_END_POINT,
      url,
      method,
      data,
    });
    dispatch(actions.apiCallSuccess(response.data));

    if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    dispatch({
      type: 'toaster/error',
      payload: { message: 'Sorry, something happend. Please try again later 🙏🏻' },
    });
    dispatch(actions.apiCallFailed(error.message));

    if (onError) dispatch({ type: onError, payload: error.message });
  }
};

export default api;
