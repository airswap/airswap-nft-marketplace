import React, { FC, ReactElement } from 'react';

import { FullOrder } from '@airswap/utils';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import OrderWidgetHeader from '../../../../compositions/OrderWidgetHeader/OrderWidgetHeader';

interface DisconnectedCancelOrderWidgetProps {
  isLoading: boolean;
  isOrderNonceUsed: boolean;
  fullOrder: FullOrder;
  className?: string;
}

const DisconnectedCancelOrderWidget: FC<DisconnectedCancelOrderWidgetProps> = ({
  isLoading,
  isOrderNonceUsed,
  fullOrder,
  className = '',
}): ReactElement => (
  <div className={`cancel-order-widget ${className}`}>
    <OrderWidgetHeader
      nftId={fullOrder.signer.id}
      title="Are you sure you want to cancel?"
    />
    <div className="cancel-order-widget__fail-details">
      {isOrderNonceUsed && 'Order nonce already used'}
    </div>
    {isLoading && <LoadingSpinner className="cancel-order-widget__loading-spinner" />}
  </div>
);

export default DisconnectedCancelOrderWidget;
