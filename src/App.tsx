import React from 'react';

import { Web3ReactProvider } from '@web3-react/core';

import { Page, Routes } from './compositions';
import { getLibrary } from './helpers/web3';


const App = () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <Page>
      <Routes />
    </Page>
  </Web3ReactProvider>
);

export default App;
