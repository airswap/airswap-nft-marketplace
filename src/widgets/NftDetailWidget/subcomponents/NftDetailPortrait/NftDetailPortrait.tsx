import React, { FC } from 'react';

import './NftDetailPortrait.scss';

interface CollectionPortraitProps {
  backgroundImage: string;
  className: string;
}

const NftDetailPortrait: FC<CollectionPortraitProps> = ({
  backgroundImage,
  className = '',
}) => (
  <div
    style={{ backgroundImage: `url("${backgroundImage}")` }}
    className={`nft-detail-portrait ${className}`}
  />
);

export default NftDetailPortrait;
