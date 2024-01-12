import React, { FC } from 'react';

import useDefaultProvider from '../../hooks/useDefaultProvider';
import { useAppSelector } from '../../redux/hooks';
import ConnectedCollectionWidget from './subcomponents/ConnectedCollectionWidget/ConnectedCollectionWidget';
import DisconnectedCollectionWidget from './subcomponents/DisconnectedCollectionWidget/DisconnectedCollectionWidget';

import './CollectionWidget.scss';

const CollectionWidget: FC = () => {
  const { currencyTokenInfo } = useAppSelector((state) => state.metadata);
  const { isInitialized } = useAppSelector((state) => state.indexer);
  const { chainId } = useAppSelector((state) => state.config);

  const provider = useDefaultProvider(chainId);

  if (currencyTokenInfo && isInitialized && provider) {
    return (
      <ConnectedCollectionWidget
        currencyTokenInfo={currencyTokenInfo}
        provider={provider}
      />
    );
  }

  return <DisconnectedCollectionWidget />;
};

export default CollectionWidget;
