import React, { FC, useEffect } from 'react';

import useCollectionToken from '../../hooks/useCollectionToken';
import useDefaultProvider from '../../hooks/useDefaultProvider';
import { useAppSelector } from '../../redux/hooks';
import ConnectedNftDetailWidget from './subcomponents/ConnectedNftDetailWidget/ConnectedNftDetailWidget';
import DisconnectedNftDetailWidget from './subcomponents/DisconnectedNftDetailWidget/DisconnectedNftDetailWidget';

import './NftDetailWidget.scss';

interface NftDetailWidgetProps {
  tokenId: string;
  className?: string;
}

const NftDetailWidget: FC<NftDetailWidgetProps> = ({ tokenId, className = '' }) => {
  const { chainId, collectionToken } = useAppSelector(state => state.config);
  const { isInitialized } = useAppSelector(state => state.indexer);
  const { currencyTokenInfo, isLoading: isMetadataLoading } = useAppSelector(state => state.metadata);
  const library = useDefaultProvider(chainId);

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
    && library
  ) {
    return (
      <ConnectedNftDetailWidget
        collectionTokenInfo={collectionTokenInfo}
        currencyTokenInfo={currencyTokenInfo}
        library={library}
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
