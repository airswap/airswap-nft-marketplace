import React, { FC, ReactElement } from 'react';

import { CollectionTokenInfo, FullOrder, TokenInfo } from '@airswap/types';

import Icon from '../../components/Icon/Icon';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import NftCard from '../../components/NftCard/NftCard';
import NftCardSkeleton from '../../components/NftCardSkeleton/NftCardSkeleton';
import { getFullOrderReadableSenderAmountPlusTotalFees } from '../../entities/FullOrder/FullOrderHelpers';
import { AppRoutes } from '../../routes';

import './OrdersContainer.scss';

interface OrdersContainerProps {
  isEndOfOrders: boolean;
  isLoading: boolean;
  currencyTokenInfo: TokenInfo;
  orders: FullOrder[];
  tokens: CollectionTokenInfo[];
  className?: string;
}

const OrdersContainer: FC<OrdersContainerProps> = ({
  isEndOfOrders,
  isLoading,
  currencyTokenInfo,
  orders,
  tokens,
  className = '',
}): ReactElement => (
  <div className={`orders-container ${className}`}>
    <div className="orders-container__orders">
      {orders
        .map(order => {
          const orderToken = tokens.find(token => token.id === +order.signer.id);
          const price = getFullOrderReadableSenderAmountPlusTotalFees(order, currencyTokenInfo);

          if (!orderToken) {
            return (
              <NftCardSkeleton
                key={order.nonce}
                price={price.toString()}
                symbol={currencyTokenInfo.symbol}
                to={`${AppRoutes.nftDetail}/${order.signer.id}`}
                className="collection-widget__nft-card"
              />
            );
          }

          return (
            <NftCard
              key={order.nonce}
              imageURI={orderToken.image}
              price={price.toString()}
              name={orderToken.name}
              symbol={currencyTokenInfo.symbol}
              to={`${AppRoutes.nftDetail}/${order.signer.id}`}
              className="collection-widget__nft-card"
            />
          );
        })}
    </div>
    <div className="orders-container__bottom">
      {isLoading && <LoadingSpinner className="orders-container__loader" />}
      {(!isLoading && isEndOfOrders) && <Icon name="airswap" className="orders-container__end-of-orders-icon" />}
    </div>
  </div>
);

export default OrdersContainer;
