import React, { FC, ReactElement } from 'react';

import { CollectionTokenInfo, TokenInfo } from '@airswap/types';

import Icon from '../../components/Icon/Icon';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../compositions/EmptyState/EmptyState';
import { ExtendedFullOrder } from '../../entities/FullOrder/FullOrder';
import { routes } from '../../routes';
import OrdersListItem from './subcomponents/OrdersListItem/OrdersListItem';

import './OrdersContainer.scss';

interface OrdersContainerProps {
  hasListCallToActionButton?: boolean;
  isEndOfOrders: boolean;
  isLoading: boolean;
  showExpiryDate?: boolean;
  currencyTokenInfo: TokenInfo;
  highlightOrderNonce?: string;
  listCallToActionText?: string;
  orders: ExtendedFullOrder[];
  tokens: CollectionTokenInfo[];
  className?: string;
}

const OrdersContainer: FC<OrdersContainerProps> = ({
  hasListCallToActionButton = false,
  isEndOfOrders,
  isLoading,
  showExpiryDate = false,
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
      <ul className="orders-container__orders">
        {orders
          .map(order => (
            <li key={order.key}>
              <OrdersListItem
                showExpiryDate={showExpiryDate}
                currencyTokenInfo={currencyTokenInfo}
                highlightOrderNonce={highlightOrderNonce}
                order={order}
                tokens={tokens}
              />
            </li>
          ))}
      </ul>
      {isLoading && <LoadingSpinner className="orders-container__loading-spinner" />}
      <div className="orders-container__end-of-orders-icon-wrapper">
        {(!isLoading && isEndOfOrders) && <Icon name="airswap" className="orders-container__end-of-orders-icon" />}
      </div>
    </div>
  );
};

export default OrdersContainer;
