import React, { FC } from 'react';

import { useParams } from 'react-router-dom';

import Page from '../../compositions/Page/Page';
import OrderDetailWidget from '../../widgets/OrderDetailWidget/OrderDetailWidget';

import './OrderDetailPage.scss';

const OrderDetailPage: FC = () => {
  const { orderNonce } = useParams<{ account: string, orderNonce: string }>();

  if (!orderNonce) {
    return (
      <Page className="order-detail-page">
        Order not defined
      </Page>
    );
  }

  return (
    <Page className="order-detail-page">
      <OrderDetailWidget orderNonce={orderNonce} />
    </Page>
  );
};

export default OrderDetailPage;
