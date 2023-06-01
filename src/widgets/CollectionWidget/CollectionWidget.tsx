import React, { FC } from 'react';

import { useAppSelector } from '../../redux/hooks';
import ConnectedCollectionWidget from './subcomponents/ConnectedCollectionWidget/ConnectedCollectionWidget';
import DisconnectedCollectionWidget from './subcomponents/DisconnectedCollectionWidget/DisconnectedCollectionWidget';

import './CollectionWidget.scss';

const CollectionWidget: FC = () => {
  const { currencyTokenInfo } = useAppSelector((state) => state.metadata);
  const { isInitialized } = useAppSelector((state) => state.indexer);

  if (currencyTokenInfo && isInitialized) {
    return (
      <ConnectedCollectionWidget
        currencyTokenInfo={currencyTokenInfo}
      />
    );
  }

  return <DisconnectedCollectionWidget />;
};

export default CollectionWidget;
