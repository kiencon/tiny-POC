import {
  applyMiddleware, compose, createStore,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from '../reducer';
import sagas from '../saga/index';

let composeEnhancers = compose;
// eslint-disable-next-line no-underscore-dangle
composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/** * redux middleware */
const sagaMiddleware = createSagaMiddleware();
const middleware = [];

// loggerMiddleware
const logger = store => next => action => {
  console.log('[Middleware] Dispatching', action);
  const result = next(action);
  console.log('[Middleware] next state', store.getState());
  return result;
};

if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

middleware.push(sagaMiddleware);
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middleware)),
);

sagaMiddleware.run(sagas);

export default store;
