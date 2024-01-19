import React, { CSSProperties, FC } from 'react';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

import './NftDetailPortrait.scss';

interface CollectionPortraitProps {
  backgroundImage: string;
  id: string;
  className?: string;
}

const NftDetailPortrait: FC<CollectionPortraitProps> = ({
  backgroundImage,
  id,
  className = '',
}) => {
  const cssProperties: CSSProperties = {
    viewTransitionName: `nft-image-${id}`,
    backgroundImage: `url("${backgroundImage}")`,
  };

  return (
    <div className={`nft-detail-portrait ${className}`}>
      <LoadingSpinner className="nft-detail-portrait__loading-spinner" />
      <div
        style={cssProperties}
        className="nft-detail-portrait__image"
      />
    </div>
  );
};

export default NftDetailPortrait;
