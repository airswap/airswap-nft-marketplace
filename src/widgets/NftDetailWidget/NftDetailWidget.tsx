import React, { FC, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '../../components/Button/Button';
import { CollectionToken } from '../../entities/CollectionToken/CollectionToken';
import useNftMetadata from '../../hooks/useNftMetadata';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchNFTActivity } from '../../redux/stores/token/tokenApi';
import { AppRoutes } from '../../routes';
import NftDetailAccordian from './subcomponents/NftDetailAccordian/NftDetailAccordian';
// import NftDetailActivity from './subcomponents/NftDetailActivity/NftDetailActivity';
// import NftDetailAttributeCard from './subcomponents/NftDetailAttributeCard/NftDetailAttributeCard';
import NftDetailMainInfo from './subcomponents/NftDetailMainInfo/NftDetailMainInfo';
import NftDetailPortrait from './subcomponents/NftDetailPortrait/NftDetailPortrait';
import NftDetailSaleInfo from './subcomponents/NftDetailSaleInfo/NftDetailSaleInfo';

import './NftDetailWidget.scss';

export interface Attribute {
  'trait_type': string;
  value: string;
}

const NftDetailWidget: FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchNFTActivity());
  }, []);

  const { config } = useAppSelector((state) => state);
  const { collectionImage } = config;
  // const { eventLogs } = token;
  const { id: selectedTokenId } = useParams();
  const nftMetadata: CollectionToken = useNftMetadata(`${selectedTokenId}`) as CollectionToken;
  const [nftPrice, setNftPrice] = useState<BigNumber>();

  useEffect(() => {
    if (!nftMetadata) return;
    const bigPrice = BigNumber.from(nftMetadata?.price);
    setNftPrice(bigPrice);
  }, [nftMetadata]);


  const navigate = useNavigate();
  const routeChange = () => {
    const path = AppRoutes.collection;
    navigate(path);
  };


  return (
    <div className="nft-detail-widget">
      <NftDetailMainInfo
        owner="sjnivo12345"
        title={nftMetadata?.name || ''}
        className="nft-detail-widget__main-info"
      />
      <NftDetailPortrait
        backgroundImage={nftMetadata?.image || collectionImage}
        className="nft-detail-widget__portrait"
      />
      <div className="nft-detail-widget__sales-meta">
        <NftDetailMainInfo
          owner="sjnivo12345"
          title={nftMetadata?.name || ''}
          className="nft-detail-widget__main-info nft-detail-widget__main-info--tablet-only"
        />
        <NftDetailSaleInfo price={nftPrice} className="nft-detail-widget__price" />
        <div className="nft-detail-widget__accordians">
          <div className="nft-detail-widget__description">
            <NftDetailAccordian
              label="Description"
              content={(
                <>
                  <p>{nftMetadata?.description}</p>
                  {/* {nftMetadata?.attributes ? <NftDetailAttributes attrs={nftMetadata?.attributes} /> : null } */}
                </>
              )}
              className="nft-detail-widget__description-accordian"
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
          <div className="nft-detail-widget__details">
            <NftDetailAccordian
              label="Details"
              content={(
                <p>{nftMetadata?.description}</p>
              )}
            />
          </div> */}
        </div>
        <Button text="Proceed to buy" className="nft-detail-widget__proceed-button" onClick={routeChange} />
      </div>
    </div>
  );
};

export default NftDetailWidget;
