import React, { FC, useEffect } from 'react';

import useCollectionToken from '../../hooks/useCollectionToken';
import { useAppSelector } from '../../redux/hooks';
import ConnectedNftDetailWidget from './subcomponents/ConnectedNftDetailWidget/ConnectedNftDetailWidget';
import DisconnectedNftDetailWidget from './subcomponents/DisconnectedNftDetailWidget/DisconnectedNftDetailWidget';

import './NftDetailWidget.scss';

interface NftDetailWidgetProps {
  tokenId: number;
  className?: string;
}

const NftDetailWidget: FC<NftDetailWidgetProps> = ({ tokenId, className = '' }) => {
  const { collectionToken } = useAppSelector(state => state.config);
  const { isInitialized } = useAppSelector(state => state.indexer);
  const { currencyTokenInfo, isLoading: isMetadataLoading } = useAppSelector(state => state.metadata);

  const [collectionTokenInfo, isLoadingCollectionTokenInfo] = useCollectionToken(collectionToken, tokenId);
  const isLoading = isMetadataLoading || isLoadingCollectionTokenInfo;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!isLoadingCollectionTokenInfo
    && !isMetadataLoading
    && isInitialized
    && collectionTokenInfo
    && currencyTokenInfo
  ) {
    return (
      <ConnectedNftDetailWidget
        collectionTokenInfo={collectionTokenInfo}
        currencyTokenInfo={currencyTokenInfo}
        className={className}
      />
    );
  }

  return (
    <DisconnectedNftDetailWidget
      isLoading={isLoading}
      isNftNotFound={!isLoading && !collectionTokenInfo}
      id={tokenId}
      className={className}
    />
  );
};

export default NftDetailWidget;
