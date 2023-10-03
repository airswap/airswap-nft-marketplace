import React, {
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TokenInfo } from '@airswap/types';

import SearchInput from '../../../../components/SearchInput/SearchInput';
import Helmet from '../../../../compositions/Helmet/Helmet';
import { INDEXER_ORDERS_OFFSET } from '../../../../constants/indexer';
import OrdersContainer from '../../../../containers/OrdersContainer/OrdersContainer';
import { filterCollectionTokenBySearchValue } from '../../../../entities/CollectionToken/CollectionTokenHelpers';
import getOwnedTokensByAccountUrl from '../../../../helpers/airswap/getOwnedTokensByAccountUrl';
import useCollectionTokens from '../../../../hooks/useCollectionTokens';
import useEnsAddress from '../../../../hooks/useEnsAddress';
import useScrollToBottom from '../../../../hooks/useScrollToBottom';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getProfileOrders } from '../../../../redux/stores/profileOrders/profileOrdersApi';
import { reset } from '../../../../redux/stores/profileOrders/profileOrdersSlice';
import ProfileHeader from '../../../ProfileWidget/subcomponents/ProfileHeader/ProfileHeader';
import getListCallToActionText from '../../helpers/getListCallToActionText';

interface ConnectedProfileOrdersWidgetProps {
  account?: string;
  currencyTokenInfo: TokenInfo;
  profileAccount: string;
  className?: string;
}

const ConnectedProfileOrdersWidget: FC<ConnectedProfileOrdersWidgetProps> = ({
  account,
  currencyTokenInfo,
  profileAccount,
  className = '',
}): ReactElement => {
  const dispatch = useAppDispatch();

  const scrolledToBottom = useScrollToBottom();

  const { chainId, collectionToken, collectionImage } = useAppSelector((state) => state.config);
  const { tokens: userTokens } = useAppSelector((state) => state.balances);
  const { avatarUrl } = useAppSelector((state) => state.user);
  const {
    hasServerError,
    isLoading,
    isTotalOrdersReached,
    offset,
    orders,
  } = useAppSelector((state) => state.profileOrders);

  const [searchValue, setSearchValue] = useState('');

  const ensAddress = useEnsAddress(profileAccount);
  const accountUrl = useMemo(() => (
    profileAccount ? getOwnedTokensByAccountUrl(chainId, profileAccount, collectionToken) : undefined
  ), [profileAccount, chainId, collectionToken]);
  const tokenIds = useMemo(() => orders.map(order => order.signer.id), [orders]);
  const [tokens] = useCollectionTokens(collectionToken, tokenIds);
  const filteredOrders = useMemo(() => (
    orders.filter(order => {
      const orderToken = tokens.find(token => token.id === +order.signer.id);

      return orderToken ? filterCollectionTokenBySearchValue(orderToken, searchValue) : true;
    })), [orders, tokens, searchValue]);
  const userIsProfileAccount = account === profileAccount;
  const listCallToActionText = getListCallToActionText(searchValue, !!orders.length, hasServerError);

  const getOrders = () => {
    if (isLoading || isTotalOrdersReached) {
      return;
    }

    dispatch(getProfileOrders({
      signerTokens: [collectionToken],
      signerWallet: profileAccount,
      offset,
      limit: INDEXER_ORDERS_OFFSET,
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

  return (
    <div className={`profile-orders-widget ${className}`}>
      <Helmet title={`Listed orders of ${ensAddress || profileAccount}`} />
      <ProfileHeader
        accountUrl={accountUrl}
        address={profileAccount}
        avatarUrl={avatarUrl}
        backgroundImage={collectionImage}
        ensAddress={ensAddress}
        className="profile-widget__header"
      />

      <div className="profile-orders-widget__content">
        <SearchInput
          placeholder="Search listings"
          onChange={e => setSearchValue(e.target.value)}
          value={searchValue || ''}
          className="profile-orders-widget__search-input"
        />
        <OrdersContainer
          hasListCallToActionButton={!!userTokens.length && userIsProfileAccount && !hasServerError}
          isEndOfOrders={isTotalOrdersReached}
          isLoading={isLoading || offset === 0}
          currencyTokenInfo={currencyTokenInfo}
          listCallToActionText={listCallToActionText}
          orders={filteredOrders}
          tokens={tokens}
          className="profile-orders-widget__nfts-container"
        />
      </div>
    </div>
  );
};

export default ConnectedProfileOrdersWidget;
