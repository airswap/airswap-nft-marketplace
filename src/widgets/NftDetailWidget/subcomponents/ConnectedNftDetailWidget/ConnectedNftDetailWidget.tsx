import React, { FC, useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { Link, useParams } from 'react-router-dom';

import Button from '../../../../components/Button/Button';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchNftMeta } from '../../../../redux/stores/nftDetail/nftDetailApi';
import { setError, setSelectedTokenId } from '../../../../redux/stores/nftDetail/nftDetailSlice';
import { AppRoutes } from '../../../../routes';
import NftDetailAccordian from '../NftDetailAccordian/NftDetailAccordian';
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
  const { config, nftDetail } = useAppSelector((state: any) => state);
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

  return (
    isLoading
    ? <p>Loading</p>
    : (
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
              <NftDetailAccordian
                label="Description"
                content={(
                  <p>{tokenMeta?.description}</p>
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

export default ConnectedNftDetailWidget;
