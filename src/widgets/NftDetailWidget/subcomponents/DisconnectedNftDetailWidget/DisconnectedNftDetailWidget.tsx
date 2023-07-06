import React, { FC } from 'react';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

interface DisconnectedNftDetailWidgetProps {
  isLoading: boolean;
  isNftNotFound: boolean;
  id: number;
  className?: string;
}

const DisconnectedNftDetailWidget: FC<DisconnectedNftDetailWidgetProps> = ({
  isLoading,
  isNftNotFound,
  id,
  className = '',
}) => (
  <div className={`nft-detail-widget ${className}`}>
    {isLoading && <LoadingSpinner className="nft-detail-widget__loading-spinner" />}
    {isNftNotFound && `NFT with id ${id} not found`}
  </div>
);

export default DisconnectedNftDetailWidget;
