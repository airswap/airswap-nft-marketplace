import React, { FC, ReactElement, useMemo } from 'react';

import { getAccountUrl, getReceiptUrl } from '@airswap/utils';

import Icon from '../../../../components/Icon/Icon';
import TransactionLink from '../../../../compositions/TransactionLink/TransactionLink';
import { NftTransactionLog } from '../../../../entities/NftTransactionLog/NftTransactionLog';
import useAddressOrEnsName from '../../../../hooks/useAddressOrEnsName';

import './NftDetailActivityItem.scss';

interface NftDetailActivityItemProps {
  chainId: number;
  log: NftTransactionLog;
  className?: string;
}

const NftDetailActivityItem: FC<NftDetailActivityItemProps> = ({ chainId, log, className = '' }): ReactElement => {
  const readableAddressName = useAddressOrEnsName(log.from, true);
  const link = useMemo(() => getAccountUrl(chainId, log.from), [chainId, log]);
  const transactionLink = useMemo(() => getReceiptUrl(chainId, log.transactionHash), [chainId, log]);

  return (
    <div className={`nft-detail-activity-item ${className}`}>
      <Icon
        name="swap-horizontal"
        className="nft-detail-activity-item__swap-icon"
      />
      <div className="nft-detail-activity-item__label">
        Transferred to
      </div>
      <a
        href={link}
        target="blank"
        className="nft-detail-activity-item__link"
      >
        {readableAddressName}
      </a>
      <div className="nft-detail-activity-item__meta">
        <TransactionLink
          hideLabel
          to={transactionLink}
          className="nft-detail-activity-item__transaction-icon"
        />
      </div>
    </div>
  );
};

export default NftDetailActivityItem;
