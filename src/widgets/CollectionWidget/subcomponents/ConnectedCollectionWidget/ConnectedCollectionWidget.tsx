import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TokenInfo } from '@airswap/utils';
import { BaseProvider } from '@ethersproject/providers';

import SearchInput from '../../../../components/SearchInput/SearchInput';
import { INDEXER_ORDERS_OFFSET } from '../../../../constants/indexer';
import OrdersContainer from '../../../../containers/OrdersContainer/OrdersContainer';
import { filterCollectionTokenBySearchValue } from '../../../../entities/CollectionToken/CollectionTokenHelpers';
import useCollectionImage from '../../../../hooks/useCollectionImage';
import useCollectionTokens from '../../../../hooks/useCollectionTokens';
import { useGetOrders } from '../../../../hooks/useGetOrders';
import useScrollToBottom from '../../../../hooks/useScrollToBottom';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getCollectionOrders } from '../../../../redux/stores/collection/collectionApi';
import { reset, startLoading } from '../../../../redux/stores/collection/collectionSlice';
import getListCallToActionText from '../../helpers/getListCallToActionText';
import CollectionPortrait from '../CollectionPortrait/CollectionPortrait';

interface ConnectedCollectionWidgetProps {
  currencyTokenInfo: TokenInfo;
  provider: BaseProvider;
  className?: string;
}

const ConnectedCollectionWidget: FC<ConnectedCollectionWidgetProps> = ({ currencyTokenInfo, provider, className = '' }) => {
  const dispatch = useAppDispatch();
  const scrolledToBottom = useScrollToBottom();
  const { bannerImage } = useCollectionImage();

  const { collectionToken, collectionName } = useAppSelector((state) => state.config);
  const { activeTags } = useAppSelector((state) => state.filters);
  const { tokenIdsWithBalance } = useAppSelector((state) => state.balances);
  const {
    hasServerError,
    isLoading,
    isTotalOrdersReached,
    offset = 0,
    orders,
  } = useAppSelector((state) => state.collection);

  const [searchValue, setSearchValue] = useState<string>('');

  const getOrders = (newOffset: number) => {
    dispatch(getCollectionOrders({
      offset: newOffset,
      limit: INDEXER_ORDERS_OFFSET,
      provider,
      tags: activeTags,
    }));
  };

  useGetOrders(
    activeTags,
    getOrders,
    reset,
    startLoading,
  );

  useEffect(() => {
    if (scrolledToBottom && !isLoading && !isTotalOrdersReached) {
      getOrders(offset);
    }
  }, [scrolledToBottom]);

  const userTokens = Object.keys(tokenIdsWithBalance);
  const tokenIds = useMemo(() => orders.map(order => order.signer.id), [orders]);
  const [tokens] = useCollectionTokens(collectionToken, tokenIds);
  const filteredOrders = useMemo(() => (
    orders.filter(order => {
      const orderToken = tokens.find(token => token.id === order.signer.id);

      return orderToken ? filterCollectionTokenBySearchValue(orderToken, searchValue) : true;
    })), [orders, tokens, searchValue]);
  const hasFilter = !!searchValue || !!activeTags.length;
  const listCallToActionText = getListCallToActionText(hasFilter, !!userTokens.length, hasServerError);

  return (
    <div className={`collection-widget ${className}`}>
      <CollectionPortrait
        backgroundImage={bannerImage}
        subTitle="Collection"
        title={collectionName}
        className="collection-widget__portrait"
      />
      <div className="collection-widget__content">
        <SearchInput
          placeholder="Search Listings"
          onChange={e => setSearchValue(e.target.value)}
          value={searchValue || ''}
          className="collection-widget__search-input"
        />

        <OrdersContainer
          hasListCallToActionButton={!!userTokens.length && !hasServerError}
          isEndOfOrders={isTotalOrdersReached}
          isLoading={isLoading || offset === 0}
          showSearchResults={hasFilter}
          currencyTokenInfo={currencyTokenInfo}
          listCallToActionText={listCallToActionText}
          orders={filteredOrders}
          tokens={tokens}
          className="collection-widget__nfts-container"
        />
      </div>
    </div>
  );
};

export default ConnectedCollectionWidget;
