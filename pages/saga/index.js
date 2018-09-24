import { fork, all } from 'redux-saga/effects';
import socket from './socket'
import auth from './auth'

export default function* rootSaga() {
  yield all([
    fork(socket),
    fork(auth),
  ]);
}
