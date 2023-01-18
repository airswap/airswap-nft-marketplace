import React from 'react';

import { Web3ReactProvider } from '@web3-react/core';

import Routes from './compositions/Routes/Routes';
import useMapWeb3ReactToStore from './hooks/useMapWeb3ReactToStore';
import { store } from './redux/store';
import { setLibrary } from './redux/stores/library/libraryslice';

const ConnectedApp = () => {
  useMapWeb3ReactToStore();

  return (
    <Routes />
  );
};

function getLibrary(provider: Record<string, unknown>) {
  store.dispatch(setLibrary(provider));
}

const App = () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <ConnectedApp />
  </Web3ReactProvider>
);

export default App;
