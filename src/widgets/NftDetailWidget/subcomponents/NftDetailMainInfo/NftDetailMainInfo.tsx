import React, { FC } from 'react';

import { Link } from 'react-router-dom';

import './NftDetailMainInfo.scss';

export interface INftDetailMainInfoProps {
  accountRoute?: string;
  title?: string;
  owner?: string;
  className?: string;
}

const NftDetailMainInfo: FC<INftDetailMainInfoProps> = ({
  accountRoute,
  title,
  owner,
  className = '',
}) => (
  <div className={`nft-detail-main-info ${className}`}>
    <h1 className="nft-detail-main-info__title">{title}</h1>
    <span className="nft-detail-main-info__owner">
      <p className="nft-detail-main-info__owner-label">Owned by&nbsp;</p>
      {(owner && accountRoute) && (
        <Link
          to={accountRoute}
          className="nft-detail-main-info__owner-name"
        >
          {owner}
        </Link>
      )}
    </span>
  </div>
);

export default NftDetailMainInfo;
