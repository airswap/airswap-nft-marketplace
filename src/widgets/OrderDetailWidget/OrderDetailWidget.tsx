import React, { FC, ReactElement, useEffect } from 'react';

import { useWeb3React } from '@web3-react/core';

import DisconnectedOrderDetail from '../../compositions/DisconnectedOrderDetail/DisconnectedOrderDetail';
import useDefaultProvider from '../../hooks/useDefaultProvider';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getNftOrderByOrderNonce } from '../../redux/stores/orderDetail/orderDetailApi';
import ConnectedOrderDetailWidget from './subcomponents/ConnectedOrderDetailWidget/ConnectedOrderDetailWidget';

import './OrderDetailWidget.scss';

interface OrderDetailWidgetProps {
  orderNonce: string;
  signerWallet: string;
  className?: string;
}

const OrderDetailWidget: FC<OrderDetailWidgetProps> = ({ orderNonce, signerWallet, className = '' }): ReactElement => {
  const { chainId } = useAppSelector((state) => state.config);

  const dispatch = useAppDispatch();
  const provider = useDefaultProvider(chainId);
  const { account } = useWeb3React();

  const { isInitialized, isLoading: isIndexerLoading } = useAppSelector(state => state.indexer);
  const { isOrderNotFound, isLoading: isOrderLoading, order } = useAppSelector(state => state.orderDetail);
  const isLoading = isIndexerLoading || isOrderLoading;

  useEffect(() => {
    if (!isInitialized || !orderNonce || !provider) {
      return;
    }

    dispatch(getNftOrderByOrderNonce({ orderNonce, signerWallet, provider }));
  }, [isInitialized, orderNonce, provider]);

  if (
    isInitialized
    && !isLoading
    && order
  ) {
    return (
      <ConnectedOrderDetailWidget
        account={account || undefined}
        order={order}
        className={className}
      />
    );
  }

  return (
    <DisconnectedOrderDetail
      isLoading={isLoading}
      isOrderNotFound={isOrderNotFound}
      orderNonce={orderNonce}
      className={className}
    />
  );
};

export default OrderDetailWidget;
