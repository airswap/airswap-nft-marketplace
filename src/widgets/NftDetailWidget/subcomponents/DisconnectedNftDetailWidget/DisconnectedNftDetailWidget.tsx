import React, { FC } from 'react';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

interface DisconnectedNftDetailWidgetProps {
  className?: string;
}

const DisconnectedNftDetailWidget: FC<DisconnectedNftDetailWidgetProps> = ({ className = '' }) => (
  <div className={`nft-detail-widget ${className}`}>
    <LoadingSpinner className="nft-detail-widget__loading-spinner" />
  </div>
);

export default DisconnectedNftDetailWidget;
