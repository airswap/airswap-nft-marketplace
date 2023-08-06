import React, { FC, ReactElement, useMemo } from 'react';

import { getReceiptUrl } from '@airswap/utils';

import Icon from '../../../../components/Icon/Icon';
import TransactionLink from '../../../../compositions/TransactionLink/TransactionLink';
import { NftTransactionLog } from '../../../../entities/NftTransactionLog/NftTransactionLog';
import getOwnedTokensByAccountUrl from '../../../../helpers/airswap/getOwnedTokensByAccountUrl';
import getTimeBetweenTwoDates from '../../../../helpers/date/getTimeBetweenTwoDates';
import useAddressOrEnsName from '../../../../hooks/useAddressOrEnsName';

import './NftDetailActivityItem.scss';

interface NftDetailActivityItemProps {
  chainId: number;
  collectionToken: string;
  log: NftTransactionLog;
  className?: string;
}

const NftDetailActivityItem: FC<NftDetailActivityItemProps> = ({
  chainId,
  collectionToken,
  log,
  className = '',
}): ReactElement => {
  const readableAddressName = useAddressOrEnsName(log.recipient, true);
  const link = useMemo(() => getOwnedTokensByAccountUrl(chainId, log.recipient, collectionToken), [chainId, log.recipient]);
  const transactionLink = useMemo(() => getReceiptUrl(chainId, log.transactionHash), [chainId, log.transactionHash]);
  const timeAgo = useMemo(() => getTimeBetweenTwoDates(new Date(), new Date(log.timestamp * 1000)), [log.timestamp]);

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
      <div className="nft-detail-activity-item__time">
        {timeAgo}
      </div>
      <TransactionLink
        hideLabel
        to={transactionLink}
        className="nft-detail-activity-item__transaction-icon"
      />
    </div>
  );
};

export default NftDetailActivityItem;
