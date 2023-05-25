import React, { FC, useEffect, useState } from 'react';

import { CollectionTokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';

import NftCard from '../../../../components/NftCard/NftCard';
import SearchInput from '../../../../components/SearchInput/SearchInput';
import { getCollectionTokensInfoFromOrders } from '../../../../entities/CollectionToken/CollectionTokenHelpers';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getFilteredOrders } from '../../../../redux/stores/indexer/indexerApi';
import { AppRoutes } from '../../../../routes';
import CollectionPortrait from '../CollectionPortrait/CollectionPortrait';

interface ConnectedCollectionWidgetProps {
  library: Web3Provider
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const ConnectedCollectionWidget: FC<ConnectedCollectionWidgetProps> = ({ library, className = '' }) => {
  const dispatch = useAppDispatch();
  const {
    collectionImage,
    collectionToken,
    collectionName,
    currencyToken,
  } = useAppSelector((state) => state.config);
  const { isInitialized, orders, isLoading: isLoadingOrders } = useAppSelector((state) => state.indexer);
  const [searchInput, setSearchInput] = useState<string>('');
  const [tokens, setTokens] = useState<CollectionTokenInfo[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const isLoading = isLoadingOrders && isLoadingMetadata;

  useEffect(() => {
    setIsLoadingMetadata(true);
    getCollectionTokensInfoFromOrders(library, orders)
      .then(value => {
        setTokens(value);
        setIsLoadingMetadata(false);
      });
  }, [orders]);

  useEffect(() => {
    if (isInitialized) {
      dispatch(getFilteredOrders({
        filter: {
          signerTokens: [collectionToken],
          senderTokens: [currencyToken],
          offset: 0,
          limit: 100,
        },
      }));
    }
  }, [isInitialized]);

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
          {tokens.map((token) => (
            <NftCard
              key={token.id}
              imageURI={token.image}
              name={token.name}
              price="0"
              to={`${AppRoutes.nftDetail}/${token.id}`}
              className="collection-widget__nft-card"
              symbol={token.name || 'AST'} // TODO: remove the backup symbol
            />
          ))}
        </div>
        {isLoading && <div className="collection-widget__nft-loader">Fetching colelction NFTs ...</div>}
      </div>
    </div>
  );
};

export default ConnectedCollectionWidget;
