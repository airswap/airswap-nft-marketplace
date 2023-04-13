import React, { FC, useMemo } from 'react';

import { CollectionTokenInfo, FullOrder, TokenInfo } from '@airswap/types';
import { BigNumber } from 'bignumber.js';
import classNames from 'classnames';

import Icon from '../../../../components/Icon/Icon';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import TradeDetails from '../../../../components/TradeDetails/TradeDetails';
import TradeNftDetails, { TradeNftDetailsProps } from '../../../../components/TradeNftDetails/TradeNftDetails';
import TransactionLink from '../../../../compositions/TransactionLink/TransactionLink';
import { getNftDetailsIcon } from '../../helpers';
import { BuyNftState } from '../ConnectedBuyNftWidget/ConnectedBuyNftWidget';

import './BuyNftWidgetDetailsContainer.scss';

interface BuyNftWidgetDetailsContainerProps {
  collectionImage: string;
  collectionName: string;
  collectionTokenInfo: CollectionTokenInfo;
  currencyTokenInfo: TokenInfo;
  fullOrder: FullOrder,
  widgetState: BuyNftState;
  className?: string;
}

const BuyNftWidgetDetailsContainer: FC<BuyNftWidgetDetailsContainerProps> = ({
  collectionImage,
  collectionName,
  collectionTokenInfo,
  currencyTokenInfo,
  fullOrder,
  widgetState,
  className = '',
}) => {
  const wrapperClassName = classNames('buy-nft-details-container', {
    [`buy-nft-details-container--has-${widgetState}-state`]: widgetState,
  }, className);

  const nftDetailsIcon: TradeNftDetailsProps['icon'] = useMemo(() => getNftDetailsIcon(widgetState), [widgetState]);

  return (
    <div className={wrapperClassName}>
      {(widgetState === BuyNftState.details || widgetState === BuyNftState.success || widgetState === BuyNftState.failed) && (
        <>
          <TradeNftDetails
            icon={nftDetailsIcon}
            collectionImage={collectionImage}
            collectionName={collectionName}
            collectionToken={collectionTokenInfo}
            className="buy-nft-details-container__trade-details"
          />
          {widgetState === BuyNftState.details && (
            <>
              <div className="buy-nft-details-container__swap-icon-container">
                <Icon className="buy-nft-details-container__swap-icon" name="swap" />
              </div>
              <TradeDetails
                amount={new BigNumber(fullOrder.sender.amount)}
                logoURI={currencyTokenInfo.logoURI}
                title="For"
                token={currencyTokenInfo}
                className="buy-nft-details-container__trade-details"
              />
            </>
          )}
          {widgetState === BuyNftState.success && (
            <TransactionLink
              to="test"
              className="buy-nft-details-container__transaction-link"
            />
          )}
        </>
      )}

      {(widgetState === BuyNftState.sign || widgetState === BuyNftState.approve) && (
        <>
          <LoadingSpinner className="buy-nft-details-container__loading-spinner--is-hidden" />

          <p className="list-nft-details-container__message">
            If your wallet does not open something went wrong
          </p>
        </>
      )}

      {(widgetState === BuyNftState.approving) && (
        <>
          <LoadingSpinner className="buy-nft-details-container__loading-spinner" />
          <TradeDetails
            logoURI={collectionTokenInfo ? collectionTokenInfo.image : collectionImage}
            title="Approving"
            token={collectionTokenInfo}
          />
          <TransactionLink
            to="test"
            className="list-nft-details-container__transaction-link"
          />
        </>
      )}

      {(widgetState === BuyNftState.buying) && (
        <>
          <LoadingSpinner className="buy-nft-details-container__loading-spinner" />
          <TradeDetails
            amount={new BigNumber(fullOrder.sender.amount)}
            logoURI={currencyTokenInfo.logoURI}
            title="For"
            token={currencyTokenInfo}
            className="buy-nft-details-container__trade-details"
          />
          <div className="buy-nft-details-container__swap-icon-container">
            <Icon className="buy-nft-details-container__swap-icon" name="swap" />
          </div>
          <TradeDetails
            logoURI={collectionTokenInfo ? collectionTokenInfo.image : collectionImage}
            title="Buy"
            token={collectionTokenInfo}
          />
          <TransactionLink
            to="test"
            className="list-nft-details-container__transaction-link"
          />
        </>
      )}
    </div>
  );
};

export default BuyNftWidgetDetailsContainer;
