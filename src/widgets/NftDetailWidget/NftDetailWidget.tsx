import React, { FC } from 'react';

import { useParams } from 'react-router-dom';

import { AppErrorType } from '../../errors/appError';
import useCollectionToken from '../../hooks/useCollectionToken';
import { useAppSelector } from '../../redux/hooks';
import { selectCurrencyTokenInfo } from '../../redux/stores/metadata/metadataSlice';
import ConnectedNftDetailWidget from './subcomponents/ConnectedNftDetailWidget/ConnectedNftDetailWidget';
import DisconnectedNftDetailWidget from './subcomponents/DisconnectedNftDetailWidget/DisconnectedNftDetailWidget';
import NftNotFound from './subcomponents/NftNotFound/NftNotFound';

import './NftDetailWidget.scss';

interface NftDetailWidgetProps {
  className?: string;
}

const NftDetailWidget: FC<NftDetailWidgetProps> = ({ className = '' }) => {
  const { id } = useParams<{ id: string }>();

  const currencyTokenInfo = useAppSelector(selectCurrencyTokenInfo);
  const { isLoading: isMetadataLoading } = useAppSelector(state => state.metadata);
  const { collectionToken } = useAppSelector(state => state.config);

  const [collectionTokenInfo, isLoadingCollectionTokenInfo] = useCollectionToken(collectionToken, id ? Number(id) : 1);

  if (id && collectionTokenInfo === AppErrorType.nftNotFound) {
    return (
      <NftNotFound id={Number(id)} />
    );
  }

  if (id
    && !isLoadingCollectionTokenInfo
    && !isMetadataLoading
    && collectionTokenInfo
    && collectionTokenInfo !== AppErrorType.nftNotFound
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

  return <DisconnectedNftDetailWidget className={className} />;
};

export default NftDetailWidget;
