import React, { FC } from 'react';

import { useParams } from 'react-router-dom';

import DisconnectedOrderDetail from '../../compositions/DisconnectedOrderDetail/DisconnectedOrderDetail';
import Helmet from '../../compositions/Helmet/Helmet';
import ConnectedPage from '../../connectors/ConnectedPage/ConnectedPage';
import OrderDetailWidget from '../../widgets/OrderDetailWidget/OrderDetailWidget';

import './OrderDetailPage.scss';

const OrderDetailPage: FC = () => {
  const { account, orderNonce } = useParams<{ account: string, orderNonce: string }>();

  if (!orderNonce || !account) {
    return (
      <ConnectedPage className="order-detail-page">
        <DisconnectedOrderDetail isOrderNonceUndefined />
      </ConnectedPage>
    );
  }

  return (
    <ConnectedPage className="order-detail-page">
      <Helmet title="Order detail" />
      <OrderDetailWidget orderNonce={orderNonce} signerWallet={account} />
    </ConnectedPage>
  );
};

export default OrderDetailPage;
