import { FC, ReactElement } from 'react';

import { FullOrder } from '@airswap/types';

import useCollectionToken from '../../hooks/useCollectionToken';
import useFullOrderNonceUsed from '../../hooks/useFullOrderNonceUsed';
import useWeb3ReactLibrary from '../../hooks/useWeb3ReactLibrary';
import { useAppSelector } from '../../redux/hooks';
import ConnectedCancelOrderWidget from './subcomponents/ConnectedCancelOrderWidget/ConnectedCancelOrderWidget';
import DisconnectedCancelOrderWidget from './subcomponents/DisconnectedCancelOrderWidget/DisconnectedCancelOrderWidget';

import './CancelOrderWidget.scss';

interface CancelOrderWidgetProps {
  order: FullOrder;
  className?: string;
}

const CancelOrderWidget: FC<CancelOrderWidgetProps> = ({ order, className = '' }): ReactElement => {
  const { library, chainId } = useWeb3ReactLibrary();
  const tokenId = order.signer.id;

  const { collectionToken } = useAppSelector((state) => state.config);

  const { isLoading: isMetadataLoading, currencyTokenInfo } = useAppSelector(state => state.metadata);

  const [collectionTokenInfo, isCollectionTokenInfoLoading] = useCollectionToken(collectionToken, tokenId);
  const [isNonceUsed, isNonceUsedLoading] = useFullOrderNonceUsed(order, false);
  const isLoading = isMetadataLoading || isCollectionTokenInfoLoading || isNonceUsedLoading;

  if (
    !isLoading
    && !isNonceUsed
    && chainId
    && collectionTokenInfo
    && currencyTokenInfo
    && library
  ) {
    return (
      <ConnectedCancelOrderWidget
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
