import React, { FC } from 'react';

import { Web3ReactProvider } from '@web3-react/core';

import Page from './compositions/Page/Page';
import Routes from './compositions/Routes/Routes';
import { getLibrary } from './helpers/web3';
import useMapWeb3ReactToStore from './hooks/useMapWeb3ReactToStore';

const ConnectedApp : FC = () => {
  useMapWeb3ReactToStore();

  return (
    <Page>
      <Routes />
    </Page>
  );
};

const App = () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <ConnectedApp />
  </Web3ReactProvider>
);

export default App;
