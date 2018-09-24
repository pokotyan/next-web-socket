export const SYNC_RESERVE = Symbol(
  'SYNC_RESERVE'
);

export const INIT_SOCKET = Symbol(
  'INIT_SOCKET'
);

export const RESERVE_UPDATE = Symbol(
  'RESERVE_UPDATE'
);

export const SELECTED_UPDATE = Symbol(
  'SELECTED_UPDATE'
);

export const syncReserve = payload => ({
  type: SYNC_RESERVE,
  payload
});

export const initSocket = payload => ({
  type: INIT_SOCKET,
  payload
});

export const reserveUpdate = payload => ({
  type: RESERVE_UPDATE,
  payload
});

export const selectedUpdate = payload => ({
  type: SELECTED_UPDATE,
  payload
});