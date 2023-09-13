import React, { FC, ReactElement } from 'react';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import OrderWidgetHeader from '../../../../compositions/OrderWidgetHeader/OrderWidgetHeader';

interface DisconnectedBuyNftWidgetProps {
  isLoading: boolean;
  nftId: string
  className?: string;
}

const DisconnectedBuyNftWidget: FC<DisconnectedBuyNftWidgetProps> = ({
  isLoading,
  nftId,
  className = '',
}): ReactElement => (
  <div className={`buy-nft-widget ${className}`}>
    <OrderWidgetHeader
      nftId={nftId}
      title="Buy NFT"
      className="buy-nft-widget__header"
    />

    {isLoading && <LoadingSpinner className="buy-nft-widget__loading-spinner" />}
  </div>
);

export default DisconnectedBuyNftWidget;
