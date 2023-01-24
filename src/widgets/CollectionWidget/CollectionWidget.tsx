import React, { FC, useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import NFTCard from '../../components/NFTCard/NFTCard';
import SearchInput from '../../components/SearchInput/SearchInput';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchNFTMetadata } from '../../redux/stores/collection/collectionApi';
import CollectionPortrait from './subcomponents/CollectionPortrait/CollectionPortrait';

import './CollectionWidget.scss';

const CollectionWidget: FC = () => {
  const dispatch = useAppDispatch();
  const { library } = useWeb3React();
  const { collectionImage, collectionName, collectionToken } = useAppSelector((state) => state.config);
  const { isLoading, tokensData, lastTokenIndex } = useAppSelector((state) => state.collection);

  const hasScrolledToBottom = useInfiniteScroll();

  const [searchInput, setSearchInput] = useState<string>('');

  const getData = (): void => {
    if (!library) {
      return;
    }

    dispatch(fetchNFTMetadata({ library, collectionToken, startIndex: lastTokenIndex }));
  };

  useEffect(() => {
    getData();
  }, [library]);

  useEffect(() => {
    if (hasScrolledToBottom && !isLoading) {
      getData();
    }
  }, [hasScrolledToBottom]);

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
          {tokensData.map((token) => (
            <NFTCard
              key={token.id}
              name={token.name}
              imageURI={token.image}
              price={token.price}
              className="collection-widget__content__nft-container__nft-card"
            />
          ))}
        </div>
        {isLoading && <div className="collection-widget__content__nft-container__nft-loading">Fetching more NFTs ...</div>}
      </div>
    </div>
  );
};

export default CollectionWidget;
