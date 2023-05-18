import React, { FC } from 'react';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

import './NftDetailPortrait.scss';

interface CollectionPortraitProps {
  backgroundImage: string;
  className?: string;
}

const NftDetailPortrait: FC<CollectionPortraitProps> = ({
  backgroundImage,
  className = '',
}) => (
  <div className={`nft-detail-portrait ${className}`}>
    <LoadingSpinner className="nft-detail-portrait__loading-spinner" />
    <div
      style={{ backgroundImage: `url("${backgroundImage}")` }}
      className="nft-detail-portrait__image"
    />
  </div>
);

export default NftDetailPortrait;
