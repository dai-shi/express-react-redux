/* eslint-env browser */

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import reducer from './reducer';

const store = createStore(reducer);

render(
  React.createElement(Provider, { store }, React.createElement(App)),
  document.getElementById('app')
);
