import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import api from './middlewares/api';
import toaster from './middlewares/toaster';
import reducer from './reducer';

export default function configStore() {
  return configureStore({
    reducer,
    middleware: [toaster, api, ...getDefaultMiddleware()],
  });
}
