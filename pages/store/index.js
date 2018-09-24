import {createStore, applyMiddleware} from "redux";
import createSagaMiddleware, { END } from 'redux-saga';
import logger from 'redux-logger';
import reducer from "../reducers";
import rootSaga from '../saga';

const sagaMiddleware = createSagaMiddleware();

/**
* @param {object} initialState
* @param {boolean} options.isServer indicates whether it is a server side or client side
* @param {Request} options.req NodeJS Request object (not set when client applies initialState from server)
* @param {Request} options.res NodeJS Request object (not set when client applies initialState from server)
* @param {boolean} options.debug User-defined debug mode param
* @param {string} options.storeKey This key will be used to preserve store in global namespace for safe HMR 
*/
export default (initialState, options) => {
  /**
   * Since Next.js does server-side rendering, you are REQUIRED to pass`initialState`
   * when creating the store.
   */

  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(
      sagaMiddleware,
      logger
    )
  );

  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga)
  }

  // run the rootSaga initially
  store.runSagaTask();

  return store;
};
