import React, { FC, useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { Link, useParams } from 'react-router-dom';

import Accordian from '../../../../components/Accordian/Accordian';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchNftMeta } from '../../../../redux/stores/nftDetail/nftDetailApi';
import { setError, setSelectedTokenId } from '../../../../redux/stores/nftDetail/nftDetailSlice';
import { AppRoutes } from '../../../../routes';
import NftDetailMainInfo from '../NftDetailMainInfo/NftDetailMainInfo';
import NftDetailPortrait from '../NftDetailPortrait/NftDetailPortrait';
// import NftDetailSaleInfo from '../NftDetailSaleInfo/NftDetailSaleInfo';

// import './NftDetailWidget.scss';

interface IConnectedNftDetailWidgetProps {
  library: Web3Provider;
}

const ConnectedNftDetailWidget: FC<IConnectedNftDetailWidgetProps> = ({ library }) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { config, nftDetail, metadata } = useAppSelector((state) => state);
  const { collectionToken, collectionImage } = config;
  const { isLoading, selectedTokenId, tokenMeta } = nftDetail;

  console.log(metadata);

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

  return (
    <div className="nft-detail-widget">
      <NftDetailMainInfo
        owner="sjnivo12345"
        title={tokenMeta?.name || ''}
        className="nft-detail-widget__main-info"
      />
      <NftDetailPortrait
        backgroundImage={tokenMeta?.image || collectionImage}
        className="nft-detail-widget__portrait"
      />
      <div className="nft-detail-widget__sales-meta">
        <NftDetailMainInfo
          owner="sjnivo12345"
          title={tokenMeta?.name || ''}
          className="nft-detail-widget__main-info nft-detail-widget__main-info--tablet-only"
        />
        {/* <NftDetailSaleInfo price={nftPrice} className="nft-detail-widget__price" /> */}
        <div className="nft-detail-widget__accordians">
          <div className="nft-detail-widget__description">
            <Accordian
              label="Description"
              content={(
                <p>{tokenMeta?.description}</p>
              )}
              className="nft-detail-widget__description-accordian"
              isDefaultOpen
            />
          </div>
        </div>
        <Link to={`/${AppRoutes.swap}/${selectedTokenId}`} className="nft-detail-widget__proceed-button">
          Proceed to buy
        </Link>
      </div>
    </div>
  );
};

export default ConnectedNftDetailWidget;
