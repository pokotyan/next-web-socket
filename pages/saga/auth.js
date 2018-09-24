import {
  put,
  take,
  all,
  fork,
} from 'redux-saga/effects';
import firebase from "firebase";
import * as authActions from '../actions/auth';
import clientCredentials from '../../credentials/client'

if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
}

function* signUp() {
  for (;;) {
    const { payload: { email, password, router } } = yield take(authActions.SIGN_UP);

    const { user } = yield firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });

    yield put(authActions.update({
      user,
      isAutherized: true
    }));

    router.push('/');
  }
}

function* signIn() {
  for (;;) {
    const { payload: { email, password, router } } = yield take(authActions.SIGN_IN);

    const { user } = yield firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });

    yield put(authActions.update({
      user,
      isAutherized: true
    }));

    router.push('/');
  }
}

function* signOut() {
  for (;;) {
    yield take(authActions.SIGN_OUT);

    yield firebase.auth().signOut().catch((error) => {
      console.log('Sign-out an error happened.');
    });

    yield put(authActions.update({
      user: null,
      isAutherized: false
    }));
  }
}

export default function* rootSaga() {
  yield all([
    fork(signUp),
    fork(signIn),
    fork(signOut),
  ]);
}
