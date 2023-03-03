import React, { FC } from 'react';

import truncateEthAddress from 'truncate-eth-address';

import './NftDetailList.scss';

interface NftDetailListProps {
  address: string;
  id: string;
  chain: string;
  standard: string;
  fee: string;
  className?: string;
}

const NftDetailList: FC<NftDetailListProps> = ({
  address, id, chain, standard, fee, className = '',
}) => (
  <div className={`nft-detail-list ${className}`}>
    <div className="nft-detail-list__item">
      <p className="nft-detail-list__item-heading">Contract Address:</p>
      <p className="nft-detail-list__item-value nft-detail-list__item-address">{address}</p>
      <p
        className="nft-detail-list__item-value nft-detail-list__item-address--is-truncated"
      >
        {truncateEthAddress(address)}
      </p>
    </div>
    <div className="nft-detail-list__item">
      <p className="nft-detail-list__item-heading">Token ID:</p>
      <p className="nft-detail-list__item-value">{`#${id}`}</p>
    </div>
    <div className="nft-detail-list__item">
      <p className="nft-detail-list__item-heading">Blockchain:</p>
      <p className="nft-detail-list__item-value">{chain}</p>
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
