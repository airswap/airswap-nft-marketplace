import React, { FC } from 'react';

import NFTCard from '../../components/NFTCard/NFTCard';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchNFTMetadata } from '../../redux/stores/collection/collectionApi';
import CollectionPortrait from './subcomponents/CollectionPortrait/CollectionPortrait';

import './CollectionWidget.scss';

const CollectionWidget: FC = () => {
  const { collectionImage, collectionName } = useAppSelector((state) => state.config);
  const { isActive } = useAppSelector((state) => state.web3);
  const { tokensData } = useAppSelector((state) => state.collection);

  const dispatch = useAppDispatch();
  const fetchCallback = async (): Promise<void> => {
    await dispatch(fetchNFTMetadata());
  };

  const { isLoading } = useInfiniteScroll({ fetchCallback });

  if (!isActive) {
    return (
      <div className="status">Collection could not be displayed...</div>
    );
  }

  return (
    <div className="collection-widget">
      <CollectionPortrait
        backgroundImage={collectionImage}
        subTitle="By Sjnivo"
        title={collectionName}
        className="collection-widget__portrait"
      />
      <div className="nft-cards-container">
        {tokensData.map((t) => (
          <NFTCard
            key={t.name}
            name={t.name}
            imageURI={t.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
            price={t.price ?? 3.333} // TODO: remove when price is saved
          />
        ))}
      </div>
      {isLoading && <div className="loading">Fetching more NFTs ...</div>}
    </div>
  );
};

export default CollectionWidget;
