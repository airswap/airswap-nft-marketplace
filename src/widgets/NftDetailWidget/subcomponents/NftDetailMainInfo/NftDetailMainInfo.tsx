import React, { FC } from 'react';

import './NftDetailMainInfo.scss';

interface NftDetailMainInfoProps {
  subTitle: string;
  title: string;
  className?: string;
}

const NftDetailMainInfo: FC<NftDetailMainInfoProps> = ({ subTitle, title, className = '' }) => (
  <div className={`nft-detail-main-info ${className}`}>
    <h1>{title}</h1>
    <h2 className="collection-portrait__sub-title">{subTitle}</h2>
  </div>
);

export default NftDetailMainInfo;
