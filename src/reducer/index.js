import { combineReducers } from 'redux';
import blocksReducer from '../state/reducer';

const reducer = combineReducers({
  blocksReducer,
});

export default reducer;
