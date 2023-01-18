import React, { FC } from 'react';

import Button from '../../components/Button/Button';
import useNftMetadata from '../../hooks/useNftMetadata';
import { useAppSelector } from '../../redux/hooks';
import NftDetailAttributeCard from './subcomponents/NftDetailAttributeCard/NftDetailAttributeCard';
import NftDetailMainInfo from './subcomponents/NftDetailMainInfo/NftDetailMainInfo';
import NftDetailPortrait from './subcomponents/NftDetailPortrait/NftDetailPortrait';

import './NftDetailWidget.scss';

const CollectionWidget: FC = () => {
  const { collectionImage, collectionToken } = useAppSelector((state) => state.config);
  // TODO: Use dynamic tokenId in place of '3060'
  const nftMetadata = useNftMetadata(collectionToken, '3060');
  console.log(nftMetadata);

  return (
    <div className="nft-detail-widget">
      <div className="nft-detail-widget__top">
        <NftDetailMainInfo
          subTitle="by sjnivo12345"
          title={nftMetadata?.name || ''}
          className="nft-detail-widget__main-info"
        />
        <NftDetailPortrait
          backgroundImage={nftMetadata?.image || collectionImage}
          className="nft-detail-widget__portrait"
        />
      </div>
      <div className="nft-detail-widget__description">
        <p>Description v</p>
        <p>{nftMetadata?.description}</p>
        <div className="nft-detail-widget__attributes">
          {
            nftMetadata?.attributes.map((attribute: Record<string, string>) => (
              <NftDetailAttributeCard key={attribute.trait_type} label={attribute.trait_type} value={attribute.value} />
            ))
          }
        </div>
      </div>
      <Button text="Proceed" className="nft-detail-widget__proceed-button" />
    </div>
  );
};

export default CollectionWidget;
