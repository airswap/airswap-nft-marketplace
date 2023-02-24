import React, { FC } from 'react';

import './NftDetailMainInfo.scss';

export interface INftDetailMainInfoProps {
  title: string;
  owner: string;
  className?: string;
}

const NftDetailMainInfo: FC<INftDetailMainInfoProps> = ({ title, owner, className = '' }) => (
  <div className={`nft-detail-main-info ${className}`}>
    <h1 className="nft-detail-main-info__title">{title}</h1>
    <span className="nft-detail-main-info__owner">
      <p className="nft-detail-main-info__owner-label">Onwed by&nbsp;</p>
      <p className="nft-detail-main-info__owner-name">{owner}</p>
    </span>
  </div>
);

export default NftDetailMainInfo;
