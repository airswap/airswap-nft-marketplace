import React, { FC } from 'react';

import Button from '../../components/Button/Button';
import useNftMetadata from '../../hooks/useNftMetadata';
import { useAppSelector } from '../../redux/hooks';
import NftDetailMainInfo from './subcomponents/NftDetailMainInfo/NftDetailMainInfo';
import NftDetailPortrait from './subcomponents/NftDetailPortrait/NftDetailPortrait';

import './NftDetailWidget.scss';

const CollectionWidget: FC = () => {
  const { collectionImage, collectionToken } = useAppSelector((state) => state.config);
  const nftMetadata = useNftMetadata(collectionToken, '3060');

  return (
    <div className="nft-detail-widget">
      <div className="nft-detail-widget__top">
        <NftDetailMainInfo
          subTitle="by sjnivo12345"
          title="Nft title"
          className="nft-detail-widget__main-info"
        />
        <NftDetailPortrait
          backgroundImage={nftMetadata?.image || collectionImage}
          className="nft-detail-widget__portrait"
        />
      </div>
      <Button text="Proceed" className="nft-detail-widget__proceed-button" />
    </div>
  );
};

export default CollectionWidget;
