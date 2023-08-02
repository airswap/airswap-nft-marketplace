import React, { FC, ReactElement } from 'react';

import { FullOrder } from '@airswap/types';

import BuyNftWidget from '../../../BuyNftWidget/BuyNftWidget';
import CancelOrderWidget from '../../../CancelOrderWidget/CancelOrderWidget';
import NftDetailWidget from '../../../NftDetailWidget/NftDetailWidget';

interface ConnectedOrderDetailWidgetProps {
  account?: string;
  order: FullOrder;
  className?: string;
}

const ConnectedOrderDetailWidget: FC<ConnectedOrderDetailWidgetProps> = ({ account, order, className = '' }): ReactElement => {
  const userIsOwner = account ? order.signer.wallet.toLowerCase() === account.toLowerCase() : false;

  return (
    <div className={`order-detail-widget ${className}`}>
      <NftDetailWidget
        tokenId={+order.signer.id}
        className="order-detail-widget__nft-detail-widget"
      />
      <div className="order-detail-widget__buy-nft-widget-container">
        {userIsOwner ? (
          <CancelOrderWidget
            order={order}
            className="order-detail-widget__cancel-order-widget"
          />
        ) : (
          <BuyNftWidget
            order={order}
            className="order-detail-widget__buy-nft-widget"
          />
        )}
      </div>
    </div>
  );
};

export default ConnectedOrderDetailWidget;
