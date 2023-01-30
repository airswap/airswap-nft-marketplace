import React, { FC } from 'react';

import { useWeb3React } from '@web3-react/core';

import ConnectedCollectionWidget from './subcomponents/ConnectedCollectionWidget/ConnectedCollectionWidget';
import DisconnectedCollectionWidget from './subcomponents/DisconnectedCollectionWidget/DisconnectedCollectionWidget';

import './CollectionWidget.scss';

const CollectionWidget: FC = () => {
  const { library } = useWeb3React();

  if (library) {
    return <ConnectedCollectionWidget library={library} />;
  }

  return <DisconnectedCollectionWidget />;
};

export default CollectionWidget;
