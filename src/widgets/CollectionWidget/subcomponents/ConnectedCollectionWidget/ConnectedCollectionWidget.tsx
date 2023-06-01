import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TokenInfo } from '@airswap/types';

import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import NftCard from '../../../../components/NftCard/NftCard';
import NftCardSkeleton from '../../../../components/NftCardSkeleton/NftCardSkeleton';
import SearchInput from '../../../../components/SearchInput/SearchInput';
import { INDEXER_ORDERS_OFFSET } from '../../../../constants/indexer';
import { getFullOrderReadableSenderAmountPlusTotalFees } from '../../../../entities/FullOrder/FullOrderHelpers';
import useCollectionTokens from '../../../../hooks/useCollectionTokens';
import useScrollToBottom from '../../../../hooks/useScrollToBottom';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getFilteredOrders } from '../../../../redux/stores/collection/collectionApi';
import { reset } from '../../../../redux/stores/collection/collectionSlice';
import { AppRoutes } from '../../../../routes';
import CollectionPortrait from '../CollectionPortrait/CollectionPortrait';

interface ConnectedCollectionWidgetProps {
  currencyTokenInfo: TokenInfo;
  className?: string;
}

const ConnectedCollectionWidget: FC<ConnectedCollectionWidgetProps> = ({ currencyTokenInfo, className = '' }) => {
  const dispatch = useAppDispatch();
  const scrolledToBottom = useScrollToBottom();
  const { collectionImage, collectionToken, collectionName } = useAppSelector((state) => state.config);
  const {
    isLoading,
    isTotalOrdersReached,
    offset,
    orders,
  } = useAppSelector((state) => state.collection);

  const [searchInput, setSearchInput] = useState<string>('');

  const getOrders = () => {
    if (isLoading || isTotalOrdersReached) {
      return;
    }

    dispatch(getFilteredOrders({
      filter: {
        signerTokens: [collectionToken],
        senderTokens: [currencyTokenInfo.address],
        offset,
        limit: INDEXER_ORDERS_OFFSET,
      },
    }));
  };

  useEffect((): () => void => {
    getOrders();

    return () => dispatch(reset());
  }, []);

  useEffect(() => {
    if (scrolledToBottom) {
      getOrders();
    }
  }, [scrolledToBottom]);

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
      </div>
      <div className="collection-widget__bottom">
        {isLoading && <LoadingSpinner className="collection-widget__loader" />}
      </div>
    </div>
  );
};

export default ConnectedCollectionWidget;
