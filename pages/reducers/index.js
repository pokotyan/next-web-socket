import { combineReducers } from 'redux';
import socket from './socket';
import auth from './auth';

const reducer = combineReducers({
  socket,
  auth
});

export default reducer;
