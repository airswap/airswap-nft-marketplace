import React, { FC, ReactElement } from 'react';

import { CollectionTokenInfo, TokenInfo } from '@airswap/utils';

import Icon from '../../components/Icon/Icon';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../compositions/EmptyState/EmptyState';
import ConnectedFilters from '../../connectors/ConnectedFilters/ConnectedFilters';
import { ExtendedFullOrder } from '../../entities/FullOrder/FullOrder';
import { routes } from '../../routes';
import OrdersListItem from './subcomponents/OrdersListItem/OrdersListItem';

import './OrdersContainer.scss';

interface OrdersContainerProps {
  hasListCallToActionButton?: boolean;
  isEndOfOrders: boolean;
  isLoading: boolean;
  showExpiryDate?: boolean;
  showSearchResults?: boolean;
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
  showSearchResults = false,
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
        <ConnectedFilters className="orders-container__filters" />

        <div className="orders-container__orders-wrapper">
          <h2 className="orders-container__orders-title">{showSearchResults ? 'Search results' : 'All listings'}</h2>

          <EmptyState
            hasButton={hasListCallToActionButton}
            buttonText="List a token"
            route={routes.listNft()}
            text={listCallToActionText}
            className="orders-container__empty-state"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`orders-container ${className}`}>
      <ConnectedFilters className="orders-container__filters" />

      <div className="orders-container__orders-wrapper">
        <h2 className="orders-container__orders-title">{showSearchResults ? 'Search results' : 'All listings'}</h2>

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
    </div>
  );
};

export default OrdersContainer;
