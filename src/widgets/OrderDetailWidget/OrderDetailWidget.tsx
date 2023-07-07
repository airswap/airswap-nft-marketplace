import React, { FC, ReactElement, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getNftOrderByOrderNonce } from '../../redux/stores/orderDetail/orderDetailApi';
import ConnectedOrderDetailWidget from './subcomponents/ConnectedOrderDetailWidget/ConnectedOrderDetailWidget';
import DisconnectedOrderDetailWidget from './subcomponents/DisconnectedOrderDetailWidget/DisconnectedOrderDetailWidget';

import './OrderDetailWidget.scss';

interface OrderDetailWidgetProps {
  orderNonce: string;
  className?: string;
}

const OrderDetailWidget: FC<OrderDetailWidgetProps> = ({ orderNonce, className = '' }): ReactElement => {
  const dispatch = useAppDispatch();

  const { isInitialized } = useAppSelector(state => state.indexer);
  const { isOrderNotFound, isLoading, order } = useAppSelector(state => state.orderDetail);
  console.log(isOrderNotFound);

  useEffect(() => {
    if (!isInitialized || !orderNonce) {
      return;
    }

    dispatch(getNftOrderByOrderNonce(orderNonce));
  }, [isInitialized, orderNonce]);

  if (
    isInitialized
    && !isLoading
    && order
  ) {
    return (
      <ConnectedOrderDetailWidget
        order={order}
        className={className}
      />
    );
  }

  return (
    <DisconnectedOrderDetailWidget className={className} />
  );
};

export default OrderDetailWidget;
