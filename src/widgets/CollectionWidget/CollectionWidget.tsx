import React, { FC, useState } from 'react';

import NFTCard from '../../components/NFTCard/NFTCard';
import SearchInput from '../../components/SearchInput/SearchInput';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchNFTMetadata } from '../../redux/stores/collection/collectionApi';
import CollectionPortrait from './subcomponents/CollectionPortrait/CollectionPortrait';

import './CollectionWidget.scss';

const CollectionWidget: FC = () => {
  const { collectionImage, collectionName } = useAppSelector((state) => state.config);
  const { tokensData } = useAppSelector((state) => state.collection);

  const dispatch = useAppDispatch();
  const fetchCallback = async (): Promise<void> => {
    await dispatch(fetchNFTMetadata());
  };

  const { isLoading } = useInfiniteScroll({ fetchCallback });

  const [searchInput, setSearchInput] = useState<string>('');
  const regExp = new RegExp(searchInput, 'i');

  return (
    <div className="collection-widget">
      <CollectionPortrait
        backgroundImage={collectionImage}
        subTitle="By Sjnivo"
        title={collectionName}
        className="collection-widget__portrait"
      />
      <div className="collection-widget__content">
        <SearchInput
          placeholder="Search Collection"
          className="collection-widget__content__search-input"
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
        />
        <div className="collection-widget__content__subtitle">NFTs for sale</div>
        <div className="collection-widget__content__filter-button" />
        <div className="collection-widget__content__nft-container">
          {tokensData.filter((t) => regExp.test(t.name)).map((t) => (
            <NFTCard
              className="collection-widget__content__nft-container__nft-card"
              key={t.name}
              name={t.name}
              imageURI={t.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
              price={t.price ?? 0.154} // TODO: remove when price is saved
            />
          ))}
        </div>
        {isLoading && <div className="collection-widget__content__nft-container__nft-loading">Fetching more NFTs ...</div>}
      </div>
    </div>
  );
};

export default CollectionWidget;
