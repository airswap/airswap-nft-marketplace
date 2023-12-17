import React, { FC } from 'react';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import ListNftWidgetHeader from '../ListNftWidgetHeader/ListNftWidgetHeader';

import '../../ListNftWidget.scss';

interface ListNftWidgetProps {
  hasNoUserTokens: boolean;
  isLoading: boolean;
  className?: string;
}

const DisconnectedListNftWidget: FC<ListNftWidgetProps> = ({
  hasNoUserTokens = false,
  isLoading = false,
  className = '',
}) => (
  <div className={`list-nft-widget ${className}`}>
    <ListNftWidgetHeader className="list-nft-widget__header" />
    {isLoading && <LoadingSpinner className="list-nft-widget__loading-spinner" />}
    {(!isLoading && hasNoUserTokens) && (
      <div className="list-nft-widget__no-tokens">
        <div className="list-nft-widget__no-tokens-title">No items found</div>
        <div className="list-nft-widget__no-tokens-subtitle">You have no NFTs to list</div>
      </div>
    )}
  </div>
);

export default DisconnectedListNftWidget;
