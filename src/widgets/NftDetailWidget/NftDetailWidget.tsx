import React, { FC, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import useCollectionToken from '../../hooks/useCollectionToken';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import ConnectedNftDetailWidget from './subcomponents/ConnectedNftDetailWidget/ConnectedNftDetailWidget';
import DisconnectedNftDetailWidget from './subcomponents/DisconnectedNftDetailWidget/DisconnectedNftDetailWidget';

import './NftDetailWidget.scss';

interface NftDetailWidgetProps {
  className?: string;
}

const NftDetailWidget: FC<NftDetailWidgetProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();

  const { orderNonce, tokenId } = useParams<{ orderNonce: string, tokenId: string }>();

  const { collectionToken } = useAppSelector(state => state.config);
  const { isInitialized } = useAppSelector(state => state.indexer);
  const { currencyTokenInfo, isLoading: isMetadataLoading } = useAppSelector(state => state.metadata);

  const [collectionTokenInfo, isLoadingCollectionTokenInfo] = useCollectionToken(collectionToken, tokenId ? +tokenId : 1);
  const isLoading = isMetadataLoading || isLoadingCollectionTokenInfo;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (orderNonce) {
      console.log(dispatch);
      // dispatch(getNftOrderByNonce({ orderNonce }));
    }
  }, [orderNonce]);

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
