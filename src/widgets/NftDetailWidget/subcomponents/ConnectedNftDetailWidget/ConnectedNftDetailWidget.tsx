import React, { FC, useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { Link, useParams } from 'react-router-dom';

import Accordion from '../../../../components/Accordion/Accordion';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchNftMeta } from '../../../../redux/stores/nftDetail/nftDetailApi';
import { setError, setSelectedTokenId } from '../../../../redux/stores/nftDetail/nftDetailSlice';
import { AppRoutes } from '../../../../routes';
import NftDetailAttributes from '../NftDetailAttributes/NftDetailAttributes';
import NftDetailList from '../NftDetailList/NftDetailList';
import NftDetailMainInfo from '../NftDetailMainInfo/NftDetailMainInfo';
import NftDetailPortrait from '../NftDetailPortrait/NftDetailPortrait';
import NftDetailSaleInfo from '../NftDetailSaleInfo/NftDetailSaleInfo';

interface IConnectedNftDetailWidgetProps {
  library: Web3Provider;
}

const ConnectedNftDetailWidget: FC<IConnectedNftDetailWidgetProps> = ({ library }) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { config, nftDetail } = useAppSelector((state) => state);
  const { collectionToken, collectionImage } = config;
  const { isLoading, selectedTokenId, tokenMeta } = nftDetail;

  const getDataForSelectedId = (): void => {
    if (!selectedTokenId || isLoading) return;
    dispatch(fetchNftMeta({ library, collectionToken, tokenId: selectedTokenId }));
  };

  useEffect(() => {
    if (!id) {
      dispatch(setError('No ID provided in URL params.'));
    } else {
      dispatch(setSelectedTokenId(id));
    }
  }, [id]);

  useEffect(() => {
    getDataForSelectedId();
  }, [selectedTokenId]);

  if (isLoading) {
    return (
      <div className="nft-detail-widget">
        <p>Loading</p>
      </div>
    );
  }

  if (tokenMeta) {
    return (
      <div className="nft-detail-widget">
        <NftDetailMainInfo
          owner="sjnivo12345"
          title={tokenMeta.name}
          className="nft-detail-widget__main-info"
        />
        <NftDetailPortrait
          backgroundImage={tokenMeta.image || collectionImage}
          className="nft-detail-widget__portrait"
        />
        <div className="nft-detail-widget__sales-meta">
          <NftDetailMainInfo
            owner="sjnivo12345"
            title={tokenMeta.name}
            className="nft-detail-widget__main-info nft-detail-widget__main-info--tablet-only"
          />
          <NftDetailSaleInfo price={BigNumber.from(tokenMeta.price)} symbol={tokenMeta.symbol} className="nft-detail-widget__price" />
          <div className="nft-detail-widget__accordions">
            <div className="nft-detail-widget__description">
              <Accordion
                label="Description"
                content={(
                  <>
                    <p>{tokenMeta?.description}</p>
                    <NftDetailAttributes attrs={tokenMeta.attributes} />
                  </>
                )}
                className="nft-detail-widget__description-accordion"
                isDefaultOpen
              />
            </div>
          </div>
          <Link to={`/${AppRoutes.swap}/${selectedTokenId}`} className="nft-detail-widget__proceed-button">
            Proceed to buy
          </Link>
        </div>
        <div className="nft-detail-widget__details">
          <Accordion
            label="Details"
            content={(
              <NftDetailList address={collectionToken} id={tokenMeta.id.toString()} chain="Unknown" standard="Unknown" fee="0.07" />
            )}
            className="nft-detail-widget__description-accordion"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="nft-detail-widget">
      <p>Error</p>
    </div>
  );
};

export default ConnectedNftDetailWidget;
