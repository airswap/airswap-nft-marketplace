import React, { FC } from 'react';

import Button from '../../components/Button/Button';
import { useAppSelector } from '../../redux/hooks';
import NftDetailPortrait from './subcomponents/CollectionPortrait/NftDetailPortrait';
import NftDetailMainInfo from './subcomponents/NftDetailMainInfo/NftDetailMainInfo';

import './NftDetailWidget.scss';

const CollectionWidget: FC = () => {
  const { collectionImage } = useAppSelector((state) => state.config);

  return (
    <div className="nft-detail-widget">
      <div className="nft-detail-widget__top">
        <NftDetailMainInfo
          subTitle="by sjnivo"
          title="Nft title"
          className="nft-detail-widget__main-info"
        />
        <NftDetailPortrait
          backgroundImage={collectionImage}
          className="nft-detail-widget__portrait"
        />
      </div>
      <Button text="Proceed" className="nft-detail-widget__proceed-button" />
    </div>
  );
};

export default CollectionWidget;
