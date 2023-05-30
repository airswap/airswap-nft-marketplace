import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';

import NftCard from '../../../../components/NftCard/NftCard';
import NftCardSkeleton from '../../../../components/NftCardSkeleton/NftCardSkeleton';
import SearchInput from '../../../../components/SearchInput/SearchInput';
import { getFullOrderReadableSenderAmountPlusTotalFees } from '../../../../entities/FullOrder/FullOrderHelpers';
import useCollectionTokens from '../../../../hooks/useCollectionTokens';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getFilteredOrders } from '../../../../redux/stores/indexer/indexerApi';
import { AppRoutes } from '../../../../routes';
import CollectionPortrait from '../CollectionPortrait/CollectionPortrait';

interface ConnectedCollectionWidgetProps {
  currencyTokenInfo: TokenInfo;
  library: Web3Provider
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const ConnectedCollectionWidget: FC<ConnectedCollectionWidgetProps> = ({ currencyTokenInfo, library, className = '' }) => {
  const dispatch = useAppDispatch();
  const { collectionImage, collectionToken, collectionName } = useAppSelector((state) => state.config);
  const { isInitialized, orders, isLoading: isLoadingOrders } = useAppSelector((state) => state.indexer);
  const [searchInput, setSearchInput] = useState<string>('');
  const isLoading = isLoadingOrders;

  useEffect(() => {
    if (isInitialized) {
      dispatch(getFilteredOrders({
        filter: {
          signerTokens: [collectionToken],
          senderTokens: [currencyTokenInfo.address],
          offset: 0,
          limit: 4,
        },
      }));
    }
  }, [isInitialized]);

  const tokenIds = useMemo(() => orders.map(order => +order.signer.id), [orders]);
  const [tokens] = useCollectionTokens(collectionToken, tokenIds);

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
          onChange={e => setSearchInput(e.target.value)}
          value={searchInput || ''}
          className="collection-widget__search-input"
        />
        <div className="collection-widget__subtitle">NFTs for sale</div>
        <div className="collection-widget__filter-button" />
        <div className="collection-widget__nfts-container">
          {orders.map(order => {
            const orderToken = tokens.find(token => token.id === +order.signer.id);
            const price = getFullOrderReadableSenderAmountPlusTotalFees(order, currencyTokenInfo);

            if (!orderToken) {
              return (
                <NftCardSkeleton
                  key={order.nonce}
                  price={price.toString()}
                  symbol={currencyTokenInfo.symbol}
                  to={`${AppRoutes.nftDetail}/${order.signer.id}`}
                  className="collection-widget__nft-card"
                />
              );
            }

            return (
              <NftCard
                key={order.nonce}
                imageURI={orderToken.image}
                price={price.toString()}
                name={orderToken.name}
                symbol={currencyTokenInfo.symbol}
                to={`${AppRoutes.nftDetail}/${order.signer.id}`}
                className="collection-widget__nft-card"
              />
            );
          })}
        </div>
        {isLoading && <div className="collection-widget__nft-loader">Fetching colllection orders ...</div>}
      </div>
    </div>
  );
};

export default ConnectedCollectionWidget;
