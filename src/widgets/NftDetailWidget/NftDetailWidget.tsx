import React, { FC, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import Button from '../../components/Button/Button';
import useNftMetadata from '../../hooks/useNftMetadata';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchNFTActivity } from '../../redux/stores/token/tokenApi';
import { AppRoutes } from '../../routes';
import NftDetailAccordian from './subcomponents/NftDetailAccordian/NftDetailAccordian';
// import NftDetailActivity from './subcomponents/NftDetailActivity/NftDetailActivity';
import NftDetailAttributeCard from './subcomponents/NftDetailAttributeCard/NftDetailAttributeCard';
import NftDetailMainInfo from './subcomponents/NftDetailMainInfo/NftDetailMainInfo';
import NftDetailPortrait from './subcomponents/NftDetailPortrait/NftDetailPortrait';

import './NftDetailWidget.scss';

export interface Attribute {
  'trait_type': string;
  value: string;
}

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

const NftDetailWidget: FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchNFTActivity());
  }, []);

  const { config } = useAppSelector((state) => state);
  const { collectionImage } = config;
  // const { eventLogs } = token;
  const { id: selectedTokenId } = useParams();
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
          subTitle="Owned by sjnivo12345"
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
          defaultOpen
        />
      </div>
      {/* <div className="nft-detail-widget__activities">
        <NftDetailAccordian
          label="Item Activity"
          content={(
            <NftDetailActivity logs={eventLogs} />
          )}
        />
      </div>
      <div className="nft-detail-widget__description">
        <NftDetailAccordian
          label="Details"
          content={(
            <p>{nftMetadata?.description}</p>
          )}
        />
      </div> */}
      <Button text="Proceed to buy" className="nft-detail-widget__proceed-button" onClick={routeChange} />
    </div>
  );
};

export default NftDetailWidget;
