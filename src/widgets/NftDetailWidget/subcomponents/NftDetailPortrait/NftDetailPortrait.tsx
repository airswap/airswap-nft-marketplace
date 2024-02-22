import React, { FC } from 'react';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import NftMedia from '../../../../components/NftMedia/NftMedia';

import './NftDetailPortrait.scss';

interface CollectionPortraitProps {
  alt: string;
  image?: string;
  id: string;
  video?: string;
  className?: string;
}

const NftDetailPortrait: FC<CollectionPortraitProps> = ({
  alt,
  id,
  image,
  video,
  className = '',
}) => (
  <div className={`nft-detail-portrait ${className}`}>
    <LoadingSpinner className="nft-detail-portrait__loading-spinner" />

    <NftMedia
      controls
      alt={alt}
      id={id}
      image={image}
      video={video}
      className="nft-detail-portrait__media"
    />
  </div>
);

export default NftDetailPortrait;
