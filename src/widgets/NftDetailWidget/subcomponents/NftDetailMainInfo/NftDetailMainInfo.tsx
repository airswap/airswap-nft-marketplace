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
    <p className="nft-detail-main-info__owner">{`Onwed by ${owner}`}</p>
  </div>
);

export default NftDetailMainInfo;
