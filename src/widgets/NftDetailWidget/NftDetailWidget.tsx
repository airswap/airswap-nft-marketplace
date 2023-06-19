import React, { FC, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import useCollectionToken from '../../hooks/useCollectionToken';
import { useAppSelector } from '../../redux/hooks';
import ConnectedNftDetailWidget from './subcomponents/ConnectedNftDetailWidget/ConnectedNftDetailWidget';
import DisconnectedNftDetailWidget from './subcomponents/DisconnectedNftDetailWidget/DisconnectedNftDetailWidget';

import './NftDetailWidget.scss';

interface NftDetailWidgetProps {
  className?: string;
}

const NftDetailWidget: FC<NftDetailWidgetProps> = ({ className = '' }) => {
  const { id } = useParams<{ id: string }>();

  const { collectionToken } = useAppSelector(state => state.config);
  const { isInitialized } = useAppSelector(state => state.indexer);
  const { currencyTokenInfo, isLoading: isMetadataLoading } = useAppSelector(state => state.metadata);

  const [collectionTokenInfo, isLoadingCollectionTokenInfo] = useCollectionToken(collectionToken, id ? Number(id) : 1);
  const isLoading = isMetadataLoading || isLoadingCollectionTokenInfo;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (id
    && !isLoadingCollectionTokenInfo
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
      id={id}
      className={className}
    />
  );
};

export default NftDetailWidget;
