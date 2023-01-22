import React, { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../components/Button/Button';
import useNftMetadata from '../../hooks/useNftMetadata';
import { useAppSelector } from '../../redux/hooks';
import { Attribute } from '../../redux/stores/collection/collectionSlice';
import { AppRoutes } from '../../routes';
import NftDetailAccordian from './subcomponents/NftDetailAccordian/NftDetailAccordian';
import NftDetailAttributeCard from './subcomponents/NftDetailAttributeCard/NftDetailAttributeCard';
import NftDetailMainInfo from './subcomponents/NftDetailMainInfo/NftDetailMainInfo';
import NftDetailPortrait from './subcomponents/NftDetailPortrait/NftDetailPortrait';

import './NftDetailWidget.scss';


// TODO: Move NftDetailAttributes into sub-component.
interface NftDetailAttributesProps {
  attrs: Array<Attribute>;
  className?: string;
}

const NftDetailAttributes: FC<NftDetailAttributesProps> = ({ attrs, className = '' }) => (
  <div className={`nft-detail-widget__attributes ${className}`}>
    {attrs.map((attribute: Attribute) => (
      <NftDetailAttributeCard key={attribute.trait_type} label={attribute.trait_type} value={attribute.value} />
    ))}
  </div>
);

const CollectionWidget: FC = () => {
  const { config, collection } = useAppSelector((state) => state);
  const { collectionImage } = config;
  const { selectedTokenId } = collection;
  const nftMetadata = useNftMetadata(`${selectedTokenId}`);

  const navigate = useNavigate();
  const routeChange = () => {
    const path = AppRoutes.collection;
    navigate(path);
  };

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
        <NftDetailAccordian
          label="Description"
          content={(
            <>
              <p>{nftMetadata?.description}</p>
              {nftMetadata?.attributes ? <NftDetailAttributes attrs={nftMetadata?.attributes} /> : null }
            </>
          )}
        />
      </div>
      <Button text="Proceed to buy" className="nft-detail-widget__proceed-button" onClick={routeChange} />
    </div>
  );
};

export default CollectionWidget;
