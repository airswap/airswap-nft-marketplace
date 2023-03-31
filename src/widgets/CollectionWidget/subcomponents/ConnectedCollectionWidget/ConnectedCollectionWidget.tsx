import React, { FC, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';

import NftCard from '../../../../components/NftCard/NftCard';
import SearchInput from '../../../../components/SearchInput/SearchInput';
import { useAppSelector } from '../../../../redux/hooks';
import { AppRoutes } from '../../../../routes';
import CollectionPortrait from '../CollectionPortrait/CollectionPortrait';

interface ConnectedCollectionWidgetProps {
  library: Web3Provider
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const ConnectedCollectionWidget: FC<ConnectedCollectionWidgetProps> = ({ library, className = '' }) => {
  const {
    collectionImage, collectionName,
  } = useAppSelector((state) => state.config);
  const {
    isLoading, tokensData,
  } = useAppSelector((state) => state.collection);

  const [searchInput, setSearchInput] = useState<string>('');

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
              price="0"
              to={`${AppRoutes.nftDetail}/${token.id}`}
              className="collection-widget__nft-card"
              symbol={token.symbol || 'AST'} // TODO: remove the backup symbol
            />
          ))}
        </div>
        {isLoading && <div className="collection-widget__nft-loader">Fetching more NFTs ...</div>}
      </div>
    </div>
  );
};

export default ConnectedCollectionWidget;
