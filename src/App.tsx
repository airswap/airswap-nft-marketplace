import React from 'react';

import { Web3ReactProvider } from '@web3-react/core';

import Routes from './compositions/Routes/Routes';
import useMapWeb3ReactToStore from './hooks/useMapWeb3ReactToStore';
import useSwapEventsSubscriber from './hooks/useSwapEventsSubscriber';
import useSwitchChain from './hooks/useSwitchChain';
import DebugPage from './pages/DebugPage/DebugPage';
import { useAppSelector } from './redux/hooks';
import { useConfig } from './redux/stores/config/configHooks';
import { selectConfigFailed } from './redux/stores/config/configSlice';
import { useIndexers } from './redux/stores/indexer/indexerHooks';
import { useMetadata } from './redux/stores/metadata/metadataHooks';
import { useTransactions } from './redux/stores/transactions/transactionsHooks';
import { useWeb3 } from './redux/stores/web3/web3Hooks';
import { prioritizedConnectors } from './web3-connectors/connections';
import ToastsWidget from './widgets/ToastsWidget/ToastsWidget';

const ConnectedApp = () => {
  const isFailed = useAppSelector(selectConfigFailed);

  useConfig();
  useMapWeb3ReactToStore();
  useTransactions();
  useMetadata();
  useIndexers();
  useSwitchChain();
  useWeb3();
  useSwapEventsSubscriber();

  if (isFailed) {
    return (
      <DebugPage />
    );
  }

  return (
    <Routes />
  );
};

const App = () => (
  <Web3ReactProvider connectors={Object.values(prioritizedConnectors).map((connector) => [connector.connector, connector.hooks])}>
    <ConnectedApp />
    <ToastsWidget />
  </Web3ReactProvider>
);

export default App;
