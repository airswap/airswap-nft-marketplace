import React, { FC, ReactElement, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getNftOrderByOrderNonce } from '../../redux/stores/orderDetail/orderDetailApi';
import BuyNftWidget from '../BuyNftWidget/BuyNftWidget';
import NftDetailWidget from '../NftDetailWidget/NftDetailWidget';

import './OrderDetailWidget.scss';

interface OrderDetailWidgetProps {
  orderNonce: string;
  className?: string;
}

const OrderDetailWidget: FC<OrderDetailWidgetProps> = ({ orderNonce, className = '' }): ReactElement => {
  const dispatch = useAppDispatch();

  const { isInitialized } = useAppSelector(state => state.indexer);
  const { order, isLoading } = useAppSelector(state => state.orderDetail);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    dispatch(getNftOrderByOrderNonce(orderNonce));
  }, [isInitialized]);

  if (!isInitialized || isLoading || !order) {
    return (
      <div className={`order-detail-widget ${className}`}>
        loader
      </div>
    );
  }

  return (
    <div className={`order-detail-widget ${className}`}>
      <NftDetailWidget
        tokenId={+order.signer.id}
        className="order-detail-widget__nft-detail-widget"
      />
      <div className="order-detail-widget__buy-nft-widget-container">
        <BuyNftWidget
          order={order}
          className="order-detail-widget__buy-nft-widget"
        />
      </div>
    </div>
  );
};

export default OrderDetailWidget;
