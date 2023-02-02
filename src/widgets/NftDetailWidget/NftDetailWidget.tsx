import React, { FC } from 'react';

import { useWeb3React } from '@web3-react/core';

import ConnectedNftDetailWidget from './subcomponents/ConnectedNftDetailWidget/ConnectedNftDetailWidget';
import DisconnectedNftDetailWidget from './subcomponents/DisconnectedNftDetailWidget/DisconnectedNftDetailWidget';

import './NftDetailWidget.scss';

const NftDetailWidget: FC = () => {
  const { library } = useWeb3React();

  if (library) return <ConnectedNftDetailWidget library={library} />;
  return <DisconnectedNftDetailWidget />;
};

export default NftDetailWidget;
