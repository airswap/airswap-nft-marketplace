import React, { FC, ReactElement } from 'react';

import DisconnectedBuyNftWidget
  from '../../../BuyNftWidget/subcomponents/DisconnectedBuyNftWidget/DisconnectedBuyNftWidget';

interface DisconnectedOrderDetailWidgetProps {
  className?: string;
}

const DisconnectedOrderDetailWidget: FC<DisconnectedOrderDetailWidgetProps> = ({ className = '' }): ReactElement => (
  <div className={`order-detail-widget ${className}`}>
    <div className="order-detail-widget__buy-nft-widget-container">
      <DisconnectedBuyNftWidget
        isLoading
        className="order-detail-widget__buy-nft-widget-loader"
      />
    </div>
  </div>
);

export default DisconnectedOrderDetailWidget;
