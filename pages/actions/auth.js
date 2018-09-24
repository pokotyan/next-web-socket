export const SIGN_UP = Symbol(
  'SIGN_UP'
);

export const SIGN_IN = Symbol(
  'SIGN_IN'
);

export const SIGN_OUT = Symbol(
  'SIGN_OUT'
);

export const UPDATE = Symbol(
  'UPDATE'
);

export const signUp = payload => ({
  type: SIGN_UP,
  payload
});

export const signIn = payload => ({
  type: SIGN_IN,
  payload
});

export const signOut = () => ({
  type: SIGN_OUT,
});

export const update = payload => ({
  type: UPDATE,
  payload
});