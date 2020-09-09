import { applyMiddleware, createStore, combineReducers, compose } from "redux";
import thunkMiddleware from "redux-thunk";

import reducer from '../reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunkMiddleware];

const store = createStore(
	combineReducers(reducer),
	composeEnhancers(applyMiddleware(...middleware))
);

export default store;
