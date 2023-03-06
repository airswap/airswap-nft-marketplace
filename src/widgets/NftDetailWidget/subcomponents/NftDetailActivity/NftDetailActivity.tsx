import React, { FC } from 'react';

import Icon from '../../../../components/Icon/Icon';
import { EventLog } from '../../../../redux/stores/nftDetail/nftDetailSlice';

import './NftDetailActivity.scss';

interface NftDetailActivityTransferProps {
  log: EventLog;
}

const NftDetailActivityTransfer: FC<NftDetailActivityTransferProps> = ({ log }) => (
  <div className="nft-detail-widget__activity">
    <Icon name="swap-horizontal" />
    <p className="nft-detail-widget__activity-label">{`Transfered to ${log.to}`}</p>
  </div>
);

interface NftDetailActivityProps {
  logs: Array<EventLog>;
  className?: string;
}

const NftDetailActivity: FC<NftDetailActivityProps> = ({ logs, className = '' }) => (
  <div className={`nft-detail-widget__activities-container ${className}`}>
    {logs.map((log: EventLog) => (
      <NftDetailActivityTransfer
        key={`${log.type}:${log.tokenId}:${log.from}:${log.to}`}
        log={log}
      />
    ))}
  </div>
);

export default NftDetailActivity;
