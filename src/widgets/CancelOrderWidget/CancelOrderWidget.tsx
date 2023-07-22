import { FC, ReactElement } from 'react';

import { FullOrder } from '@airswap/types';
import { useWeb3React } from '@web3-react/core';

import useCollectionToken from '../../hooks/useCollectionToken';
import useFullOrderNonceUsed from '../../hooks/useFullOrderNonceUsed';
import { useAppSelector } from '../../redux/hooks';
import ConnectedCancelOrderWidget from './subcomponents/ConnectedCancelOrderWidget/ConnectedCancelOrderWidget';
import DisconnectedCancelOrderWidget from './subcomponents/DisconnectedCancelOrderWidget/DisconnectedCancelOrderWidget';

import './CancelOrderWidget.scss';

interface CancelOrderWidgetProps {
  order: FullOrder;
  className?: string;
}

const CancelOrderWidget: FC<CancelOrderWidgetProps> = ({ order, className = '' }): ReactElement => {
  const { account, chainId, library } = useWeb3React();
  const tokenId = +order.signer.id;

  const { collectionToken } = useAppSelector((state) => state.config);
  const { isLoading: isMetadataLoading, currencyTokenInfo } = useAppSelector(state => state.metadata);

  const [collectionTokenInfo, isCollectionTokenInfoLoading] = useCollectionToken(collectionToken, tokenId);
  const [isNonceUsed, isNonceUsedLoading] = useFullOrderNonceUsed(order);
  const isLoading = isMetadataLoading || isCollectionTokenInfoLoading || isNonceUsedLoading;

  if (
    !isLoading
    && account
    && chainId
    && collectionTokenInfo
    && currencyTokenInfo
    && library
  ) {
    return (
      <ConnectedCancelOrderWidget
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
    <DisconnectedCancelOrderWidget
      isLoading={isLoading}
      isOrderNonceUsed={isNonceUsed}
      fullOrder={order}
      className={className}
    />
  );
};

export default CancelOrderWidget;
