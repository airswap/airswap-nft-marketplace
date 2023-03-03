import React, { FC, useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { useParams } from 'react-router-dom';

import Accordion from '../../../../components/Accordion/Accordion';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchNftMeta } from '../../../../redux/stores/nftDetail/nftDetailApi';
import { setError, setSelectedTokenId } from '../../../../redux/stores/nftDetail/nftDetailSlice';
import NftDetailAttributes from '../NftDetailAttributes/NftDetailAttributes';
import NftDetailContentContainer from '../NftDetailContentContainer/NftDetailContentContainer';
import NftDetailList from '../NftDetailList/NftDetailList';
import NftDetailMainInfo from '../NftDetailMainInfo/NftDetailMainInfo';
import NftDetailPortrait from '../NftDetailPortrait/NftDetailPortrait';
import NftDetailProceedButton from '../NftDetailProceedButton/NftDetailProceedButton';
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

  useEffect(() => {
    if (!id) {
      dispatch(setError('No ID provided in URL params.'));
    } else {
      dispatch(setSelectedTokenId(id));
      if (isLoading) return;
      dispatch(fetchNftMeta({ library, collectionToken, tokenId: id }));
    }
  }, [id]);

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
        <NftDetailContentContainer className="nft-detail-widget__mobile-view">
          <NftDetailMainInfo
            owner="sjnivo12345"
            title={tokenMeta.name}
            className="nft-detail-widget__main-info"
          />
          <NftDetailPortrait
            backgroundImage={tokenMeta.image || collectionImage}
            className="nft-detail-widget__portrait"
          />
          <NftDetailSaleInfo
            price={BigNumber.from(tokenMeta.price)}
            symbol={tokenMeta.symbol}
            className="nft-detail-widget__price"
          />
          <Accordion
            label="Description"
            content={(
              <p>{tokenMeta?.description}</p>
            )}
            className="nft-detail-widget__description-accordion"
            isDefaultOpen
          />
          <NftDetailProceedButton id={selectedTokenId} />
          <Accordion
            label="Properties"
            content={(
              <NftDetailAttributes attrs={tokenMeta.attributes} />
            )}
            className="nft-detail-widget__properties-accordion"
            isDefaultOpen
          />
          <Accordion
            label="Details"
            content={(
              <NftDetailList
                address={collectionToken}
                id={tokenMeta.id.toString()}
                chain="Unknown"
                standard="Unknown"
                fee="Unknown"
              />
            )}
            className="nft-detail-widget__description-accordion"
          />
        </NftDetailContentContainer>
        <NftDetailContentContainer className="nft-detail-widget__desktop-view">
          <div className="nft-detail-widget__column">
            <NftDetailPortrait
              backgroundImage={tokenMeta.image || collectionImage}
              className="nft-detail-widget__portrait"
            />
            <div className="nft-detail-widget__meta-container">
              <p className="nft-detail-widget__meta-container-label">Details</p>
              <div className="accordion__content accordion__content--has-border">
                <NftDetailList
                  address={collectionToken}
                  id={tokenMeta.id.toString()}
                  chain="Unknown"
                  standard="Unknown"
                  fee="Unknown"
                />
              </div>
            </div>
            <div className="nft-detail-widget__meta-container">
              <NftDetailAttributes attrs={tokenMeta.attributes} />
            </div>
          </div>
          <div className="nft-detail-widget__column">
            <NftDetailMainInfo
              owner="sjnivo12345"
              title={tokenMeta.name}
              className="nft-detail-widget__main-info"
            />
            <div className="nft-detail-widget__meta-container">
              <p className="nft-detail-widget__meta-container-label">Description</p>
              <p>{tokenMeta?.description}</p>
            </div>
            <NftDetailSaleInfo
              price={BigNumber.from(tokenMeta.price)}
              symbol={tokenMeta.symbol}
              className="nft-detail-widget__price"
            />
            <NftDetailProceedButton id={selectedTokenId} />
          </div>
        </NftDetailContentContainer>
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
