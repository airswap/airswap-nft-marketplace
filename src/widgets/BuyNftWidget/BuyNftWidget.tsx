import React, { FC } from 'react';

import { FullOrder } from '@airswap/types';
import { useWeb3React } from '@web3-react/core';

import useCollectionToken from '../../hooks/useCollectionToken';
import useFullOrderNonceUsed from '../../hooks/useFullOrderNonceUsed';
import { useAppSelector } from '../../redux/hooks';
import ConnectedBuyNftWidget from './subcomponents/ConnectedBuyNftWidget/ConnectedBuyNftWidget';
import DisconnectedBuyNftWidget from './subcomponents/DisconnectedBuyNftWidget/DisconnectedBuyNftWidget';

import './BuyNftWidget.scss';

interface BuyNftWidgetProps {
  order: FullOrder;
  className?: string;
}

const BuyNftWidget: FC<BuyNftWidgetProps> = ({ order, className = '' }) => {
  const {
    account,
    chainId,
    isActive,
  } = useWeb3React();
  const tokenId = order.signer.id;

  const {
    collectionImage,
    collectionName,
    collectionToken,
    chainId: configChainId,
  } = useAppSelector((state) => state.config);
  const { isLoading: isMetadataLoading, currencyTokenInfo } = useAppSelector(state => state.metadata);
  const { connectionType } = useAppSelector(state => state.web3);

  const { provider: library } = useWeb3React();

  const [collectionTokenInfo, isCollectionTokenInfoLoading] = useCollectionToken(collectionToken, tokenId);
  const [isNonceUsed, isNonceUsedLoading] = useFullOrderNonceUsed(order);
  const isLoading = isMetadataLoading || isCollectionTokenInfoLoading || isNonceUsedLoading;

  if (
    !isLoading
    && isActive
    && account
    && chainId === configChainId
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
      isActive={isActive}
      isLoading={isLoading}
      chainId={chainId}
      configChainId={configChainId}
      collectionImage={collectionImage}
      collectionName={collectionName}
      collectionTokenInfo={collectionTokenInfo}
      connectionType={connectionType}
      currencyTokenInfo={currencyTokenInfo}
      fullOrder={order}
      nftId={tokenId}
      className={className}
    />
  );
};

export default BuyNftWidget;
