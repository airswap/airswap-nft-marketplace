import React, { FC, ReactElement, useMemo } from 'react';

import { CollectionTokenInfo, TokenInfo } from '@airswap/utils';

import NftCard from '../../../../components/NftCard/NftCard';
import NftCardSkeleton from '../../../../components/NftCardSkeleton/NftCardSkeleton';
import { ExtendedFullOrder } from '../../../../entities/FullOrder/FullOrder';
import {
  getFullOrderExpiryDate,
  getFullOrderLabelTranslation,
  getFullOrderReadableSenderAmountPlusTotalFees,
} from '../../../../entities/FullOrder/FullOrderHelpers';
import { routes } from '../../../../routes';
import { FullOrderState } from '../../../../types/FullOrderState';

interface OrdersListItemProps {
  showExpiryDate?: boolean;
  currencyTokenInfo: TokenInfo;
  highlightOrderNonce?: string;
  order: ExtendedFullOrder;
  tokens: CollectionTokenInfo[];
  className?: string;
}

const OrdersListItem: FC<OrdersListItemProps> = ({
  showExpiryDate,
  currencyTokenInfo,
  highlightOrderNonce,
  order,
  tokens,
  className = '',
}): ReactElement => {
  const orderToken = useMemo(() => (
    tokens.find(token => token.id === order.signer.id)
  ), [tokens, order]);
  const price = useMemo(() => getFullOrderReadableSenderAmountPlusTotalFees(order, currencyTokenInfo), [order, currencyTokenInfo]);
  const isHighlighted = order.nonce === highlightOrderNonce;
  const label = getFullOrderLabelTranslation(order.state, isHighlighted);

  if (!orderToken) {
    return (
      <NftCardSkeleton
        isHighlighted={order.nonce === highlightOrderNonce}
        price={price.toString()}
        symbol={currencyTokenInfo.symbol}
        to={routes.nftDetail(order.signer.id)}
        className={`orders-list-item ${className}`}
      />
    );
  }

  return (
    <NftCard
      isDisabled={order.state !== FullOrderState.open}
      isHighlighted={isHighlighted}
      expiry={showExpiryDate ? getFullOrderExpiryDate(order) : undefined}
      id={order.signer.id}
      imageURI={orderToken.image}
      label={label}
      price={price.toString()}
      name={orderToken.name}
      symbol={currencyTokenInfo.symbol}
      to={routes.nftDetail(order.signer.id)}
      className={`orders-list-item ${className}`}
    />
  );
};

export default OrdersListItem;
