import React, { FC } from 'react';

import { NftTransactionLog } from '../../../../entities/NftTransactionLog/NftTransactionLog';
import NftDetailActivityItem from '../NftDetailActivityItem/NftDetailActivityItem';

import './NftDetailActivity.scss';

interface NftDetailActivityProps {
  chainId: number;
  collectionToken: string;
  logs: NftTransactionLog[];
  className?: string;
}

const NftDetailActivity: FC<NftDetailActivityProps> = ({
  chainId,
  collectionToken,
  logs,
  className = '',
}) => (
  <div className={`nft-detail-activity ${className}`}>
    {logs.length === 0 && 'No activity found'}
    {logs.map(log => (
      <NftDetailActivityItem
        chainId={chainId}
        collectionToken={collectionToken}
        key={log.transactionHash}
        log={log}
      />
    ))}
  </div>
);

export default NftDetailActivity;
