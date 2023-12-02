import React, { FC, ReactElement } from 'react';

import { CollectionTokenInfo, FullOrder, TokenInfo } from '@airswap/types';

import Icon from '../../components/Icon/Icon';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import NftCard from '../../components/NftCard/NftCard';
import NftCardSkeleton from '../../components/NftCardSkeleton/NftCardSkeleton';
import EmptyState from '../../compositions/EmptyState/EmptyState';
import { getFullOrderReadableSenderAmountPlusTotalFees } from '../../entities/FullOrder/FullOrderHelpers';
import { routes } from '../../routes';

import './OrdersContainer.scss';

interface OrdersContainerProps {
  hasListCallToActionButton?: boolean;
  isEndOfOrders: boolean;
  isLoading: boolean;
  currencyTokenInfo: TokenInfo;
  highlightOrderNonce?: string;
  listCallToActionText?: string;
  orders: FullOrder[];
  tokens: CollectionTokenInfo[];
  className?: string;
}

const OrdersContainer: FC<OrdersContainerProps> = ({
  hasListCallToActionButton = false,
  isEndOfOrders,
  isLoading,
  currencyTokenInfo,
  highlightOrderNonce,
  listCallToActionText,
  orders,
  tokens,
  className = '',
}): ReactElement => {
  if (!isLoading && !orders.length) {
    return (
      <div className={`orders-container ${className}`}>
        <EmptyState
          hasButton={hasListCallToActionButton}
          buttonText="List a token"
          route={routes.listNft()}
          text={listCallToActionText}
          className="orders-container__empty-state"
        />
      </div>
    );
  }

  return (
    <div className={`orders-container ${className}`}>
      <div className="orders-container__orders">
        {orders
          .map(order => {
            const orderToken = tokens.find(token => token.id === +order.signer.id);
            const price = getFullOrderReadableSenderAmountPlusTotalFees(order, currencyTokenInfo);
            const isHighlighted = order.nonce === highlightOrderNonce;

            if (!orderToken) {
              return (
                <NftCardSkeleton
                  key={order.nonce}
                  isHighlighted={order.nonce === highlightOrderNonce}
                  price={price.toString()}
                  symbol={currencyTokenInfo.symbol}
                  to={routes.nftDetail(order.signer.id)}
                  className="collection-widget__nft-card"
                />
              );
            }

            return (
              <NftCard
                key={order.nonce}
                isHighlighted={isHighlighted}
                imageURI={orderToken.image}
                label={isHighlighted ? 'Newly listed' : undefined}
                price={price.toString()}
                name={orderToken.name}
                symbol={currencyTokenInfo.symbol}
                to={routes.nftDetail(order.signer.id)}
                className="collection-widget__nft-card"
              />
            );
          })}
      </div>
      {isLoading && <LoadingSpinner className="orders-container__loading-spinner" />}
      <div className="orders-container__end-of-orders-icon-wrapper">
        {(!isLoading && isEndOfOrders) && <Icon name="airswap" className="orders-container__end-of-orders-icon" />}
      </div>
    </div>
  );
};

export default OrdersContainer;
