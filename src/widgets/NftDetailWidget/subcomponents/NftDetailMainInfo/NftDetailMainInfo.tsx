import React, { FC } from 'react';

import { Link } from 'react-router-dom';

import Button from '../../../../components/Button/Button';

import './NftDetailMainInfo.scss';

export interface INftDetailMainInfoProps {
  accountRoute?: string;
  title?: string;
  owner?: string;
  ownersLength?: number;
  onOwnersButtonClick: () => void;
  className?: string;
}

const NftDetailMainInfo: FC<INftDetailMainInfoProps> = ({
  accountRoute,
  title,
  owner,
  ownersLength = 0,
  onOwnersButtonClick,
  className = '',
}) => (
  <div className={`nft-detail-main-info ${className}`}>
    <h1 className="nft-detail-main-info__title">{title}</h1>
    <span className="nft-detail-main-info__owner">
      <p className="nft-detail-main-info__owner-label">Owned by&nbsp;</p>

      {(owner && ownersLength === 1 && accountRoute) && (
        <Link
          to={accountRoute}
          className="nft-detail-main-info__owner-name"
        >
          {owner}
        </Link>
      )}

      {ownersLength > 1 && (
        <Button
          className="nft-detail-main-info__owners-button"
          onClick={onOwnersButtonClick}
        >
          {`${ownersLength > 100 ? '100+' : ownersLength} addresses`}
        </Button>
      )}
    </span>
  </div>
);

export default NftDetailMainInfo;
