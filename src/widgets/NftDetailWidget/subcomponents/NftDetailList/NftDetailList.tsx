import React, { FC } from 'react';

import { chainNames } from '@airswap/constants';
import { getAccountUrl } from '@airswap/utils';
import truncateEthAddress from 'truncate-eth-address';

import './NftDetailList.scss';

interface NftDetailListProps {
  address: string;
  id: number;
  chainId: number;
  standard: string;
  fee: number;
  className?: string;
}

const NftDetailList: FC<NftDetailListProps> = ({
  address,
  id,
  chainId,
  standard,
  fee,
  className = '',
}) => (
  <div className={`nft-detail-list ${className}`}>
    <div className="nft-detail-list__item">
      <p className="nft-detail-list__item-heading">Contract Address:</p>
      <a
        href={getAccountUrl(chainId, address)}
        rel="noreferrer"
        target="_blank"
        className="nft-detail-list__item-value nft-detail-list__item-link"
      >
        <div className="nft-detail-list__item-link-address">
          {address}
        </div>
        <div className="nft-detail-list__item-link-truncated-address">
          {truncateEthAddress(address)}
        </div>
      </a>
    </div>
    <div className="nft-detail-list__item">
      <p className="nft-detail-list__item-heading">Token ID:</p>
      <p className="nft-detail-list__item-value">{`#${id}`}</p>
    </div>
    <div className="nft-detail-list__item">
      <p className="nft-detail-list__item-heading">Blockchain:</p>
      <p className="nft-detail-list__item-value">{chainNames[chainId] || chainId}</p>
    </div>
    <div className="nft-detail-list__item">
      <p className="nft-detail-list__item-heading">Token Standard:</p>
      <p className="nft-detail-list__item-value">{standard}</p>
    </div>
    <div className="nft-detail-list__item">
      <p className="nft-detail-list__item-heading">Trading Fee:</p>
      <p className="nft-detail-list__item-value">{`${fee}% (Paid by seller)`}</p>
    </div>
  </div>
);
export default NftDetailList;
