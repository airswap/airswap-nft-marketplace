import React, {
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import SearchInput from '../../../../components/SearchInput/SearchInput';
import { INDEXER_ORDERS_OFFSET } from '../../../../constants/indexer';
import OrdersContainer from '../../../../containers/OrdersContainer/OrdersContainer';
import { filterCollectionTokenBySearchValue } from '../../../../entities/CollectionToken/CollectionTokenHelpers';
import { getOwnedTokensByAccountUrl } from '../../../../helpers/airswap';
import useCollectionTokens from '../../../../hooks/useCollectionTokens';
import useEnsAddress from '../../../../hooks/useEnsAddress';
import useScrollToBottom from '../../../../hooks/useScrollToBottom';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getProfileOrders } from '../../../../redux/stores/profileOrders/profileOrdersApi';
import { reset } from '../../../../redux/stores/profileOrders/profileOrdersSlice';
import ProfileHeader from '../../../ProfileWidget/subcomponents/ProfileHeader/ProfileHeader';

interface ConnectedProfileOrdersWidgetProps {
  account: string;
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

  const { deactivate } = useWeb3React<Web3Provider>();
  const scrolledToBottom = useScrollToBottom();

  const { chainId, collectionToken, collectionImage } = useAppSelector((state) => state.config);
  const { avatarUrl } = useAppSelector((state) => state.user);
  const {
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
  const tokenIds = useMemo(() => orders.map(order => +order.signer.id), [orders]);
  const [tokens] = useCollectionTokens(collectionToken, tokenIds);
  const filteredOrders = useMemo(() => (
    orders.filter(order => {
      const orderToken = tokens.find(token => token.id === +order.signer.id);

      return orderToken ? filterCollectionTokenBySearchValue(orderToken, searchValue) : true;
    })), [orders, tokens, searchValue]);

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

  const handleDisconnectClick = () => {
    deactivate();
  };

  return (
    <div className={`profile-orders-widget ${className}`}>
      <ProfileHeader
        showLogOutButton={account === profileAccount}
        accountUrl={accountUrl}
        address={profileAccount}
        avatarUrl={avatarUrl}
        backgroundImage={collectionImage}
        ensAddress={ensAddress}
        onLogoutButtonClick={handleDisconnectClick}
        className="profile-widget__header"
      />

      <div className="profile-orders-widget__content">
        <SearchInput
          placeholder="Search Collection"
          onChange={e => setSearchValue(e.target.value)}
          value={searchValue || ''}
          className="profile-orders-widget__search-input"
        />
        <OrdersContainer
          isEndOfOrders={isTotalOrdersReached}
          isLoading={isLoading}
          currencyTokenInfo={currencyTokenInfo}
          orders={filteredOrders}
          tokens={tokens}
          className="profile-orders-widget__nfts-container"
        />
      </div>
    </div>
  );
};

export default ConnectedProfileOrdersWidget;
