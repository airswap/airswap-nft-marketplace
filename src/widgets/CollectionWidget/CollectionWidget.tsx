import React, { FC, useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import NftCard from '../../components/NftCard/NftCard';
import SearchInput from '../../components/SearchInput/SearchInput';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchNFTMetadata } from '../../redux/stores/collection/collectionApi';
import { AppRoutes } from '../../routes';
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
          className="collection-widget__search-input"
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
        />
        <div className="collection-widget__subtitle">NFTs for sale</div>
        <div className="collection-widget__filter-button" />
        <div className="collection-widget__nfts-container">
          {tokensData.map((token) => (
            <NftCard
              key={token.id}
              imageURI={token.image}
              name={token.name}
              price={token.price}
              to={`${AppRoutes.nftDetail}/${token.id}`}
              className="collection-widget__nft-card"
            />
          ))}
        </div>
        {isLoading && <div className="collection-widget__nft-loader">Fetching more NFTs ...</div>}
      </div>
    </div>
  );
};

export default CollectionWidget;
