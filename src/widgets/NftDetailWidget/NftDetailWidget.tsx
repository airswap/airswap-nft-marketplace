import React, { FC, useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { Link, useParams } from 'react-router-dom';

import Button from '../../components/Button/Button';
import { CollectionToken } from '../../entities/CollectionToken/CollectionToken';
import useNftMetadata from '../../hooks/useNftMetadata';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchNFTMetadata, fetchNFTMetadataParams } from '../../redux/stores/collection/collectionApi';
import { AppRoutes } from '../../routes';
import NftDetailAccordian from './subcomponents/NftDetailAccordian/NftDetailAccordian';
import NftDetailMainInfo from './subcomponents/NftDetailMainInfo/NftDetailMainInfo';
import NftDetailPortrait from './subcomponents/NftDetailPortrait/NftDetailPortrait';
import NftDetailSaleInfo from './subcomponents/NftDetailSaleInfo/NftDetailSaleInfo';

import './NftDetailWidget.scss';

const NftDetailWidget: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nftDataIsLoading, setNftDataIsLoading] = useState<boolean>(false);
  const [nftPrice, setNftPrice] = useState<BigNumber>();

  const { library } = useWeb3React();
  const { id: selectedTokenId } = useParams();
  const { config, collection } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  let nftMetadata: CollectionToken = useNftMetadata(selectedTokenId || '0') as CollectionToken;

  const { collectionImage, collectionToken } = config;
  const { tokensData } = collection;

  const loadingComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (!library) return;
    if (nftMetadata && !nftMetadata.id && !nftDataIsLoading) {
      const fetchArgs: fetchNFTMetadataParams = {
        library,
        collectionToken,
        startIndex: 0,
        tokenId: parseInt(selectedTokenId || '0', 10),
      };
      dispatch(fetchNFTMetadata({ ...fetchArgs }));
      setNftDataIsLoading(true);
    } else {
      nftMetadata = tokensData[tokensData.findIndex((token) => token.id === parseInt(selectedTokenId || '0', 10))] as CollectionToken;
      if (!nftMetadata || !nftMetadata.id) return;
      setNftDataIsLoading(false);
      setNftPrice(BigNumber.from(nftMetadata?.price || 0));
      loadingComplete();
    }
  }, [selectedTokenId, library, tokensData.length]);

  return (
    isLoading
    ? <p>Loading</p>
    : (
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
                  <p>{nftMetadata?.description}</p>
                )}
                className="nft-detail-widget__description-accordian"
                defaultOpen
              />
            </div>
          </div>
          <Link to={`/${AppRoutes.swap}/${selectedTokenId}`}>
            <Button text="Proceed to buy" className="nft-detail-widget__proceed-button" />
          </Link>
        </div>
      </div>
    )
  );
};

export default NftDetailWidget;
