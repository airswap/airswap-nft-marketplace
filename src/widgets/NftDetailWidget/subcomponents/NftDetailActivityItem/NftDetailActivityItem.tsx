import React, { FC, ReactElement, useMemo } from 'react';

import { getReceiptUrl } from '@airswap/utils';
import { NavLink } from 'react-router-dom';

import Icon from '../../../../components/Icon/Icon';
import TransactionLink from '../../../../compositions/TransactionLink/TransactionLink';
import { NftTransactionLog } from '../../../../entities/NftTransactionLog/NftTransactionLog';
import getTimeBetweenTwoDates from '../../../../helpers/date/getTimeBetweenTwoDates';
import useAddressOrEnsName from '../../../../hooks/useAddressOrEnsName';
import { routes } from '../../../../routes';

import './NftDetailActivityItem.scss';

interface NftDetailActivityItemProps {
  chainId: number;
  log: NftTransactionLog;
  className?: string;
}

const NftDetailActivityItem: FC<NftDetailActivityItemProps> = ({
  chainId,
  log,
  className = '',
}): ReactElement => {
  const readableAddressName = useAddressOrEnsName(log.recipient, true);
  const link = routes.profile(log.recipient);
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
      <NavLink
        to={link}
        className="nft-detail-activity-item__link"
      >
        {readableAddressName}
      </NavLink>
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
