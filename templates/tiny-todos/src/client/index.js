/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import reducer from './reducer';

const store = createStore(reducer);

const render = (Component) => {
  ReactDOM.render(
    React.createElement(AppContainer, {},
      React.createElement(Provider, { store }, React.createElement(Component))),
    document.getElementById('app'));
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NewApp = require('./App').default;
    render(NewApp);
  });
  module.hot.accept('./reducers', () => {
    const newReducer = require('./reducer').default;
    store.replaceReducer(newReducer);
  });
}
