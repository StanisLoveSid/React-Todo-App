import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import App from './components/app';
import { mainReducer } from './reducers';
import thunk from 'redux-thunk';

const store = createStore(mainReducer, applyMiddleware(thunk));

let rootElement = document.getElementById('root');

render(
	<Provider store={store}>
		<App />
	</Provider>,
	rootElement
);