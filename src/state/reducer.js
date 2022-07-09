import immutable from 'immutable';
import { ACTION, CONNECTED, DISCONNECT, WAITING } from './action';

export const initialState = {
  isConnected: false,
  isWaiting: false,
  action: '',
};

const init = () => {
  const initValue = immutable.fromJS({
    data: undefined,
    isLoading: undefined,
    effect: 0,
  });

  return initValue
    .set('data', {
      ...initialState,
    })
    .set('isLoading', false)
    .set('effect', 0);
};

const blocksReducer = (state = init(), action) => {
  switch (action.type) {
    case CONNECTED: {
      return state.update('data', () => ({
        isConnected: true
      }));
    }
    case DISCONNECT: {
      return state.update('data', () => ({
        isConnected: false
      }));
    }
    case WAITING: {
      return state.update('data', data => ({
        ...data,
        action: '',
        isWaiting: true,
      }));
    }
    case ACTION: {
      return state.update('data', data => ({
        ...data,
        isWaiting: false,
        action: action.payload,
      }));
    }
    default:
      return state;
  }
};

export default blocksReducer;
