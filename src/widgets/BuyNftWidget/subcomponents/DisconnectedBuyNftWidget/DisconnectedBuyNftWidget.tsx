import React, { FC } from 'react';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import BuyNftWidgetHeader from '../BuyNftWidgetHeader/BuyNftWidgetHeader';

interface DisconnectedBuyNftWidgetProps {
  isLoading: boolean;
  className?: string;
}

const DisconnectedBuyNftWidget: FC<DisconnectedBuyNftWidgetProps> = ({ isLoading = false, className = '' }) => (
  <div className={`buy-nft-widget ${className}`}>
    <BuyNftWidgetHeader
      title="Buy NFT"
      className="buy-nft-widget__header"
    />
    {isLoading && <LoadingSpinner className="buy-nft-widget__loading-spinner" />}
  </div>
);

export default DisconnectedBuyNftWidget;
