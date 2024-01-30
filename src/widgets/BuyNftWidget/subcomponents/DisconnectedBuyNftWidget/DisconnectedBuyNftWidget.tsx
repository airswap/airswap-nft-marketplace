import React, { FC, ReactElement } from 'react';

import {
  chainNames,
  CollectionTokenInfo,
  FullOrder,
  TokenInfo,
} from '@airswap/utils';

import Button from '../../../../components/Button/Button';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import OrderWidgetHeader from '../../../../compositions/OrderWidgetHeader/OrderWidgetHeader';
import { useAppDispatch } from '../../../../redux/hooks';
import { setShowConnectModal } from '../../../../redux/stores/web3/web3Slice';
import { ConnectionType } from '../../../../web3-connectors/connections';
import { switchNetwork } from '../../../../web3-connectors/helpers';
import BuyNftWidgetDetailsContainer from '../BuyNftWidgetDetailsContainer/BuyNftWidgetDetailsContainer';
import { BuyNftState } from '../ConnectedBuyNftWidget/ConnectedBuyNftWidget';

interface DisconnectedBuyNftWidgetProps {
  isActive: boolean;
  isLoading: boolean;
  chainId?: number;
  configChainId: number;
  collectionImage: string;
  collectionName: string;
  collectionTokenInfo?: CollectionTokenInfo;
  currencyTokenInfo?: TokenInfo;
  connectionType?: ConnectionType;
  fullOrder: FullOrder;
  nftId: string
  className?: string;
}

const DisconnectedBuyNftWidget: FC<DisconnectedBuyNftWidgetProps> = ({
  isActive,
  isLoading,
  chainId,
  configChainId,
  collectionImage,
  collectionName,
  collectionTokenInfo,
  connectionType,
  currencyTokenInfo,
  fullOrder,
  nftId,
  className = '',
}): ReactElement => {
  const dispatch = useAppDispatch();

  const handleSwitchChainClick = (): void => {
    if (connectionType) {
      switchNetwork(configChainId, connectionType);
    }
  };

  const handleConnectWalletClick = (): void => {
    dispatch(setShowConnectModal(true));
  };

  return (
    <div className={`buy-nft-widget ${className}`}>
      <OrderWidgetHeader
        nftId={nftId}
        title="Buy NFT"
        className="buy-nft-widget__header"
      />

      {(collectionTokenInfo && currencyTokenInfo && configChainId) && (
        <BuyNftWidgetDetailsContainer
          chainId={configChainId}
          collectionImage={collectionImage}
          collectionName={collectionName}
          collectionTokenInfo={collectionTokenInfo}
          currencyTokenInfo={currencyTokenInfo}
          fullOrder={fullOrder}
          widgetState={BuyNftState.details}
          className="buy-nft-widget__trade-details-container"
        />
      )}

      {isLoading && <LoadingSpinner className="buy-nft-widget__button-loading-spinner" />}
      {!isLoading && !isActive && (
        <Button
          text="Connect wallet"
          onClick={handleConnectWalletClick}
          className="buy-nft-widget__action-button"
        />
      )}
      {!isLoading && isActive && chainId !== configChainId && (
        <Button
          text={`Switch to ${chainNames[configChainId]}`}
          onClick={handleSwitchChainClick}
          className="buy-nft-widget__action-button"
        />
      )}
    </div>
  );
};

export default DisconnectedBuyNftWidget;
