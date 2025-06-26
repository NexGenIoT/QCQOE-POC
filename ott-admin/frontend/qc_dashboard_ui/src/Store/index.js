/**
 * Redux Store
 */
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from "redux-saga";
import reducers from './Reducers';
import RootSaga from "../Sagas";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

//const middleware = [sagaMiddleware];
const composeEnhancers =
   process.env.NODE_ENV === "development"
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== undefined
         ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
         : compose
      : null || compose;

const configureStore = (initialState) => {
   const store = createStore(
      reducers,
      initialState,
      composeEnhancers(applyMiddleware(sagaMiddleware))
   );

   sagaMiddleware.run(RootSaga);

   if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('./Reducers/index', () => {
         const nextRootReducer = require('./Reducers/index');
         store.replaceReducer(nextRootReducer);
      });
   }

   return store;
}

const store = configureStore()
export default store;
