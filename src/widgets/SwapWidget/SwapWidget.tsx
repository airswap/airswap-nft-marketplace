import React, { FC } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import ConnectedSwapWidget from './subcomponents/ConnectedSwapWidget/ConnectedSwapWidget';
import DisconnectedSwapWidget from './subcomponents/DisconnectedSwapWidget/DisconnectedSwapWidget';

const SwapWidget: FC = () => {
  const { library, account } = useWeb3React<Web3Provider>();

  if (library && account) {
    return (
      <ConnectedSwapWidget account={account} library={library} />
    );
  }

  return (
    <DisconnectedSwapWidget />
  );
};

export default SwapWidget;
