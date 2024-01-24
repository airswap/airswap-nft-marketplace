import React, { FC } from 'react';

import { FullOrder } from '@airswap/types';

import useCollectionImage from '../../hooks/useCollectionImage';
import useCollectionToken from '../../hooks/useCollectionToken';
import useFullOrderNonceUsed from '../../hooks/useFullOrderNonceUsed';
import useWeb3ReactLibrary from '../../hooks/useWeb3ReactLibrary';
import { useAppSelector } from '../../redux/hooks';
import ConnectedBuyNftWidget from './subcomponents/ConnectedBuyNftWidget/ConnectedBuyNftWidget';
import DisconnectedBuyNftWidget from './subcomponents/DisconnectedBuyNftWidget/DisconnectedBuyNftWidget';

import './BuyNftWidget.scss';

interface BuyNftWidgetProps {
  order: FullOrder;
  className?: string;
}

const BuyNftWidget: FC<BuyNftWidgetProps> = ({ order, className = '' }) => {
  const { library, chainId } = useWeb3ReactLibrary();
  const { bannerImage } = useCollectionImage();

  const { collectionName, collectionToken, chainId: configChainId } = useAppSelector((state) => state.config);
  const { isLoading: isMetadataLoading, currencyTokenInfo } = useAppSelector(state => state.metadata);
  const { isActive, account, connectionType } = useAppSelector(state => state.web3);

  const tokenId = order.signer.id;
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
      collectionImage={bannerImage}
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
