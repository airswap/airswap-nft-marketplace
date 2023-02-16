

import React, { FC, useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';

import NftCard from '../../../../components/NftCard/NftCard';
import SearchInput from '../../../../components/SearchInput/SearchInput';
import useInfiniteScroll from '../../../../hooks/useInfiniteScroll';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchCollectionTokens } from '../../../../redux/stores/collection/collectionApi';
import { AppRoutes } from '../../../../routes';
import CollectionPortrait from '../CollectionPortrait/CollectionPortrait';

interface ConnectedCollectionWidgetProps {
  library: Web3Provider
  className?: string;
}

const ConnectedCollectionWidget: FC<ConnectedCollectionWidgetProps> = ({ library, className = '' }) => {
  const dispatch = useAppDispatch();
  const {
    collectionImage, collectionName, collectionToken, currencyToken,
  } = useAppSelector((state) => state.config);
  const {
    allTokensAreLoaded,
    isLoading,
    tokensData,
    lastTokenIndex,
  } = useAppSelector((state) => state.collection);

  const hasScrolledToBottom = useInfiniteScroll();

  const [searchInput, setSearchInput] = useState<string>('');

  const getData = (): void => {
    dispatch(fetchCollectionTokens({ library, collectionToken, startIndex: lastTokenIndex }));
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (hasScrolledToBottom && !isLoading && !allTokensAreLoaded) {
      getData();
    }
  }, [hasScrolledToBottom]);

  return (
    <div className={`collection-widget ${className}`}>
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
              price={token.price.toString()}
              to={`${AppRoutes.nftDetail}/${token.id}`}
              className="collection-widget__nft-card"
              symbol="AST" // TODO: Update with the real value.
            />
          ))}
        </div>
        {isLoading && <div className="collection-widget__nft-loader">Fetching more NFTs ...</div>}
      </div>
    </div>
  );
};

export default ConnectedCollectionWidget;
