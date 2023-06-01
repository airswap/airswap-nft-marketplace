import React, { FC, useEffect } from 'react';

import { useWeb3React } from '@web3-react/core';
import { useParams } from 'react-router-dom';

import useCollectionToken from '../../hooks/useCollectionToken';
import useFullOrderNonceUsed from '../../hooks/useFullOrderNonceUsed';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getNftOrder } from '../../redux/stores/nftDetail/nftDetailApi';
import ConnectedBuyNftWidget from './subcomponents/ConnectedBuyNftWidget/ConnectedBuyNftWidget';
import DisconnectedBuyNftWidget from './subcomponents/DisconnectedBuyNftWidget/DisconnectedBuyNftWidget';

import './BuyNftWidget.scss';

interface BuyNftWidgetProps {
  className?: string;
}

const BuyNftWidget: FC<BuyNftWidgetProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();

  const { account, chainId, library } = useWeb3React();
  const { id: paramsId } = useParams<{ id: string }>();
  const tokenId = paramsId ? +paramsId : 0;

  const { collectionToken } = useAppSelector((state) => state.config);
  const { isInitialized } = useAppSelector(state => state.indexer);
  const { isLoading: isMetadataLoading, currencyTokenInfo } = useAppSelector(state => state.metadata);
  const { order, isLoading: isNftDetailLoading, isOrderNotFound } = useAppSelector((state) => state.nftDetail);

  const [collectionTokenInfo, isCollectionTokenInfoLoading] = useCollectionToken(collectionToken, tokenId);
  const [isNonceUsed, isNonceUsedLoading] = useFullOrderNonceUsed(order);
  const isLoading = isMetadataLoading || isCollectionTokenInfoLoading || isNonceUsedLoading || isNftDetailLoading;

  useEffect(() => {
    if (!isInitialized || !tokenId) {
      return;
    }

    dispatch(getNftOrder({ tokenId: +tokenId }));
  }, [isInitialized]);

  if (
    !isLoading
    && !isOrderNotFound
    && account
    && chainId
    && collectionTokenInfo
    && currencyTokenInfo
    && order
    && +order.signer.id === tokenId
    && library
  ) {
    return (
      <ConnectedBuyNftWidget
        isOrderNonceUsed={isNonceUsed}
        account={account}
        chainId={chainId}
        collectionTokenInfo={collectionTokenInfo}
        currencyTokenInfo={currencyTokenInfo}
        fullOrder={order}
        library={library}
        className={className}
      />
    );
  }

  return (
    <DisconnectedBuyNftWidget
      isLoading={isLoading}
      isOrderNotFound={isOrderNotFound}
      nftId={tokenId}
      className={className}
    />
  );
};

export default BuyNftWidget;
