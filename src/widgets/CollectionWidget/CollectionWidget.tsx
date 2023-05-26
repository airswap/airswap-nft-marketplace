import React, { FC } from 'react';

import { useWeb3React } from '@web3-react/core';

import { useAppSelector } from '../../redux/hooks';
import ConnectedCollectionWidget from './subcomponents/ConnectedCollectionWidget/ConnectedCollectionWidget';
import DisconnectedCollectionWidget from './subcomponents/DisconnectedCollectionWidget/DisconnectedCollectionWidget';

import './CollectionWidget.scss';

const CollectionWidget: FC = () => {
  const { library } = useWeb3React();

  const { currencyTokenInfo } = useAppSelector((state) => state.metadata);

  if (library && currencyTokenInfo) {
    return (
      <ConnectedCollectionWidget
        currencyTokenInfo={currencyTokenInfo}
        library={library}
      />
    );
  }

  return <DisconnectedCollectionWidget />;
};

export default CollectionWidget;
