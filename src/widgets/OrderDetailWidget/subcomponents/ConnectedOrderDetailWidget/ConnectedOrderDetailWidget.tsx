import React, { FC, ReactElement } from 'react';

import { FullOrder } from '@airswap/types';

import BuyNftWidget from '../../../BuyNftWidget/BuyNftWidget';
import NftDetailWidget from '../../../NftDetailWidget/NftDetailWidget';

interface ConnectedOrderDetailWidgetProps {
  account?: string;
  order: FullOrder;
  className?: string;
}

const ConnectedOrderDetailWidget: FC<ConnectedOrderDetailWidgetProps> = ({ account, order, className = '' }): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  const userIsOwner = account ? order.signer.wallet.toLowerCase() === account.toLowerCase() : false;
  // TODO: If user is owner, show cancel widget. https://github.com/orgs/airswap/projects/9?pane=issue&itemId=31108633

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

export default ConnectedOrderDetailWidget;
