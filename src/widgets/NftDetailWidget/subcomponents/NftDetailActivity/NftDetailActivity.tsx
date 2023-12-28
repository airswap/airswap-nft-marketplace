import React, { FC } from 'react';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { NftTransactionLog } from '../../../../entities/NftTransactionLog/NftTransactionLog';
import NftDetailActivityItem from '../NftDetailActivityItem/NftDetailActivityItem';

import './NftDetailActivity.scss';

interface NftDetailActivityProps {
  isLoading: boolean;
  chainId: number;
  logs: NftTransactionLog[];
  className?: string;
}

const NftDetailActivity: FC<NftDetailActivityProps> = ({
  isLoading,
  chainId,
  logs,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`nft-detail-activity ${className}`}>
        <LoadingSpinner className="nft-detail-activity__loading-spinner" />
      </div>
    );
  }

  return (
    <div className={`nft-detail-activity ${className}`}>
      <div className="nft-detail-activity__items-wrapper">
        {logs.length === 0 && 'No activity found'}
        {logs.map(log => (
          <NftDetailActivityItem
            chainId={chainId}
            key={log.transactionHash}
            log={log}
          />
        ))}
      </div>
    </div>
  );
};

export default NftDetailActivity;
