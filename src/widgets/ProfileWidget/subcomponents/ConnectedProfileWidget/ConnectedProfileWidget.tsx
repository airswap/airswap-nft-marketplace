import {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TokenInfo } from '@airswap/types';
import { BaseProvider } from '@ethersproject/providers';
import { useSearchParams } from 'react-router-dom';

import SearchInput from '../../../../components/SearchInput/SearchInput';
import EmptyState from '../../../../compositions/EmptyState/EmptyState';
import Helmet from '../../../../compositions/Helmet/Helmet';
import { INDEXER_ORDERS_OFFSET } from '../../../../constants/indexer';
import { filterCollectionTokenBySearchValue } from '../../../../entities/CollectionToken/CollectionTokenHelpers';
import getOwnedTokensByAccountUrl from '../../../../helpers/airswap/getOwnedTokensByAccountUrl';
import useCollectionTokens from '../../../../hooks/useCollectionTokens';
import useEnsAddress from '../../../../hooks/useEnsAddress';
import useScrollToBottom from '../../../../hooks/useScrollToBottom';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getProfileOrders, getProfileTokens } from '../../../../redux/stores/profile/profileApi';
import { reset, setTokensOffset } from '../../../../redux/stores/profile/profileSlice';
import getEmptyStateText from '../../helpers/getEmptyTokensText';
import OwnedNftsContainer from '../OwnedNftsContainer/OwnedNftsContainer';
import ProfileHeader from '../ProfileHeader/ProfileHeader';

interface ConnectedProfileWidgetProps {
  currencyTokenInfo: TokenInfo;
  library: BaseProvider;
  profileAccount: string;
  className?: string;
}

const ConnectedProfileWidget: FC<ConnectedProfileWidgetProps> = ({
  currencyTokenInfo,
  library,
  profileAccount,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const scrolledToBottom = useScrollToBottom();

  const { chainId, collectionToken, collectionImage } = useAppSelector((state) => state.config);
  const { avatarUrl } = useAppSelector((state) => state.user);
  const {
    isLoadingTokens: isLoadingUserTokens,
    tokens: ownedTokenIds,
    orders,
    tokensOffset,
  } = useAppSelector((state) => state.profile);

  const highlightTokenId = searchParams.get('highlightTokenId');
  const [searchValue, setSearchValue] = useState('');

  const shouldHighlightToken = !!(highlightTokenId && ownedTokenIds.length);
  const sortedOwnedTokenIds = [...(shouldHighlightToken ? [highlightTokenId] : []), ...ownedTokenIds.filter(token => token !== highlightTokenId)];

  const isEndOfTokens = tokensOffset >= sortedOwnedTokenIds.length;
  const ensAddress = useEnsAddress(profileAccount);
  const accountUrl = useMemo(() => (
    profileAccount ? getOwnedTokensByAccountUrl(chainId, profileAccount, collectionToken) : undefined
  ), [profileAccount, chainId, collectionToken]);
  const [tokens, isLoadingTokens, tokensError] = useCollectionTokens(collectionToken, sortedOwnedTokenIds.splice(0, tokensOffset));

  const isLoading = isLoadingUserTokens || isLoadingTokens;
  const filteredTokens = useMemo(() => (tokens
    .filter(nft => filterCollectionTokenBySearchValue(nft, searchValue))
    .slice(0, tokensOffset)
  ), [tokens, tokensOffset, searchValue]);
  const emptyStateText = getEmptyStateText(searchValue, !!tokens.length);

  useEffect((): () => void => {
    dispatch(getProfileOrders({
      signerTokens: [collectionToken],
      signerWallet: profileAccount,
      offset: 0,
      limit: 9999,
    }));

    dispatch(getProfileTokens({ account: profileAccount, provider: library }));

    return () => {
      dispatch(reset());
    };
  }, [profileAccount]);

  useEffect(() => {
    if (scrolledToBottom && !isEndOfTokens && !tokensError) {
      dispatch(setTokensOffset(tokensOffset + INDEXER_ORDERS_OFFSET));
    }
  }, [scrolledToBottom]);

  return (
    <div className={`profile-widget ${className}`}>
      <Helmet title={`Owned nft's of ${ensAddress || profileAccount}`} />
      <ProfileHeader
        accountUrl={accountUrl}
        address={profileAccount}
        avatarUrl={avatarUrl}
        backgroundImage={collectionImage}
        ensAddress={ensAddress}
        className="profile-widget__header"
      />
      <div className="profile-widget__content">
        <SearchInput
          placeholder="Search tokens"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="profile-widget__search-input"
        />
        <div className="profile-widget__collections">
          {!filteredTokens.length && !isLoading ? (
            <EmptyState
              text={emptyStateText}
              className="profile-widget__empty-state"
            />
            ) : (
              <OwnedNftsContainer
                isEndOfTokens={isEndOfTokens}
                isLoading={isLoading || tokensOffset === 0}
                currencyTokenInfo={currencyTokenInfo}
                highlightTokenId={highlightTokenId || undefined}
                orders={orders}
                tokens={filteredTokens}
                className="profile-widget__nfts-container"
              />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectedProfileWidget;
