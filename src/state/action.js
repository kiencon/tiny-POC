export const CONNECTED = 'CONNECTED';
export const connectSuccess = () => ({
  type: CONNECTED,
});
export const DISCONNECT = 'DISCONNECT';
export const disconnect = () => ({
  type: DISCONNECT,
});
export const WAITING = 'WAITING';
export const waiting = payload => ({
  type: WAITING,
  payload,
});
export const ACTION = 'ACTION';
export const action = payload => ({
  type: ACTION,
  payload,
});
