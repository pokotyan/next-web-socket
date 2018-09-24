import * as authActions from '../actions/auth';

const initialState = {
  user: null,
  isAutherized: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case authActions.UPDATE:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
