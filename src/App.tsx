import React from 'react';

import { Web3ReactProvider } from '@web3-react/core';

import Routes from './compositions/Routes/Routes';
import { setLibrary } from './helpers/ethers';
import useHistoricalTransactions from './hooks/useHistoricalTransactions';
import useMapWeb3ReactToStore from './hooks/useMapWeb3ReactToStore';

const ConnectedApp = () => {
  useMapWeb3ReactToStore();
  useHistoricalTransactions();

  return (
    <Routes />
  );
};

const App = () => (
  <Web3ReactProvider getLibrary={setLibrary}>
    <ConnectedApp />
  </Web3ReactProvider>
);

export default App;
