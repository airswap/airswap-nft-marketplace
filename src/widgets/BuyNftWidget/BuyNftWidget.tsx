import React, { FC, useEffect } from 'react';

import { FullOrder } from '@airswap/types';
import { useWeb3React } from '@web3-react/core';

import useCollectionToken from '../../hooks/useCollectionToken';
import useFullOrderNonceUsed from '../../hooks/useFullOrderNonceUsed';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getNftOrderByTokenId } from '../../redux/stores/nftDetail/nftDetailApi';
import ConnectedBuyNftWidget from './subcomponents/ConnectedBuyNftWidget/ConnectedBuyNftWidget';
import DisconnectedBuyNftWidget from './subcomponents/DisconnectedBuyNftWidget/DisconnectedBuyNftWidget';

import './BuyNftWidget.scss';

interface BuyNftWidgetProps {
  order: FullOrder;
  className?: string;
}

const BuyNftWidget: FC<BuyNftWidgetProps> = ({ order, className = '' }) => {
  const dispatch = useAppDispatch();

  const { account, chainId, library } = useWeb3React();
  const tokenId = +order.signer.id;

  const { collectionToken } = useAppSelector((state) => state.config);
  const { isInitialized } = useAppSelector(state => state.indexer);
  const { isLoading: isMetadataLoading, currencyTokenInfo } = useAppSelector(state => state.metadata);

  const [collectionTokenInfo, isCollectionTokenInfoLoading] = useCollectionToken(collectionToken, tokenId);
  const [isNonceUsed, isNonceUsedLoading] = useFullOrderNonceUsed(order);
  const isLoading = isMetadataLoading || isCollectionTokenInfoLoading || isNonceUsedLoading;

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    dispatch(getNftOrderByTokenId(+tokenId));
  }, [isInitialized]);

  if (
    !isLoading
    && account
    && chainId
    && collectionTokenInfo
    && currencyTokenInfo
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
      nftId={tokenId ? +tokenId : 1}
      className={className}
    />
  );
};

export default BuyNftWidget;
