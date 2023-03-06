import React, { FC } from 'react';

import { useAppSelector } from '../../../../redux/hooks';
import NftDetailMainInfo from '../NftDetailMainInfo/NftDetailMainInfo';
import NftDetailPortrait from '../NftDetailPortrait/NftDetailPortrait';

// import './NftDetailWidget.scss';

const DisconnectedNftDetailWidget: FC = () => {
  const { collection } = useAppSelector((state: any) => state);
  const { collectionImage } = collection;

  return (
    <div className="nft-detail-widget">
      <NftDetailMainInfo
        owner="sjnivo12345"
        title="Wallet Disconnected"
        className="nft-detail-widget__main-info"
      />
      <NftDetailPortrait
        backgroundImage={collectionImage}
        className="nft-detail-widget__portrait"
      />
    </div>
  );
};

export default DisconnectedNftDetailWidget;
