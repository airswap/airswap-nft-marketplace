import React, { FC } from 'react';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

interface DisconnectedNftDetailWidgetProps {
  isLoading: boolean;
  isNftNotFound: boolean;
  isNetworkError: boolean;
  id: string;
  className?: string;
}

const DisconnectedNftDetailWidget: FC<DisconnectedNftDetailWidgetProps> = ({
  isLoading,
  isNftNotFound,
  isNetworkError,
  id,
  className = '',
}) => (
  <div className={`nft-detail-widget nft-detail-widget--is-disconnected ${className}`}>
    {isLoading && <LoadingSpinner className="nft-detail-widget__loading-spinner" />}
    {(!isLoading && isNftNotFound) && `NFT with id ${id} not found`}
    {(!isLoading && isNetworkError) && 'Network error. Could not fetch NFT metadata.'}
  </div>
);

export default DisconnectedNftDetailWidget;
