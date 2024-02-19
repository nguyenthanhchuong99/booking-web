import { combineReducers } from '@reduxjs/toolkit';
import shouldRenderReducer from './reducer';

const rootReducer = combineReducers({
  shouldRender: shouldRenderReducer,
});

export default rootReducer;
