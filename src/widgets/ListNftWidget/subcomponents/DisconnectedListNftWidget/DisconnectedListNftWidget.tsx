import React, { FC } from 'react';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import ListNftWidgetHeader from '../ListNftWidgetHeader/ListNftWidgetHeader';

import '../../ListNftWidget.scss';

interface ListNftWidgetProps {
  isLoading: boolean;
  className?: string;
}

const DisconnectedListNftWidget: FC<ListNftWidgetProps> = ({
  isLoading = false,
  className = '',
}) => (
  <div className={`list-nft-widget ${className}`}>
    <ListNftWidgetHeader
      title="List NFT"
      className="list-nft-widget__header"
    />
    {isLoading && <LoadingSpinner className="list-nft-widget__loading-spinner" />}
  </div>
);

export default DisconnectedListNftWidget;
