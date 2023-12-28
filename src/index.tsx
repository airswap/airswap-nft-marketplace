import React from 'react';

import { Alchemy } from 'alchemy-sdk';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import { getAlchemyChain } from './helpers/alchemy';
import { store } from './redux/store';
import reportWebVitals from './reportWebVitals';

import './styles/global.scss';

window.alchemy = new Alchemy({
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: getAlchemyChain(+(process.env.REACT_APP_CHAIN_ID || '1')),
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
