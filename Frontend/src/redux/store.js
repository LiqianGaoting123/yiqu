import {createStore, applyMiddleware, compose} from 'redux';
import reducers from './reducer';
const configureStore = preloadedState => {
    return createStore(reducers, preloadedState, compose(applyMiddleware()));
}

const store = configureStore();

export default store;