import {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import NftCard from '../../../../components/NftCard/NftCard';
import SearchInput from '../../../../components/SearchInput/SearchInput';
import { filterCollectionTokenBySearchValue } from '../../../../entities/CollectionToken/CollectionTokenHelpers';
import { getFullOrderReadableSenderAmountPlusTotalFees } from '../../../../entities/FullOrder/FullOrderHelpers';
import { getOwnedTokensByAccountUrl } from '../../../../helpers/airswap';
import useCollectionTokens from '../../../../hooks/useCollectionTokens';
import useEnsAddress from '../../../../hooks/useEnsAddress';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getProfileOrders, getProfileTokens } from '../../../../redux/stores/profile/profileApi';
import { reset } from '../../../../redux/stores/profile/profileSlice';
import { AppRoutes } from '../../../../routes';
import ProfileHeader from '../ProfileHeader/ProfileHeader';

interface ConnectedProfileWidgetProps {
  account: string;
  currencyTokenInfo: TokenInfo;
  library: Web3Provider;
  profileAccount: string;
  className?: string;
}

const ConnectedProfileWidget: FC<ConnectedProfileWidgetProps> = ({
  account,
  currencyTokenInfo,
  library,
  profileAccount,
  className = '',
}) => {
  const dispatch = useAppDispatch();

  const { deactivate } = useWeb3React<Web3Provider>();

  const { chainId, collectionToken, collectionImage } = useAppSelector((state) => state.config);
  const { avatarUrl } = useAppSelector((state) => state.user);
  const { tokens: ownedTokenIds, orders } = useAppSelector((state) => state.profile);

  const [searchValue, setSearchValue] = useState('');

  const ensAddress = useEnsAddress(profileAccount);
  const accountUrl = useMemo(() => (
    profileAccount ? getOwnedTokensByAccountUrl(chainId, profileAccount, collectionToken) : undefined
  ), [profileAccount, chainId, collectionToken]);
  const [tokens] = useCollectionTokens(collectionToken, ownedTokenIds);
  const filteredTokens = useMemo(() => (
    tokens.filter(nft => filterCollectionTokenBySearchValue(nft, searchValue))
  ), [tokens, searchValue]);

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

  const handleDisconnectClick = () => {
    deactivate();
  };

  return (
    <div className={`profile-widget ${className}`}>
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
      <div className="profile-widget__content">
        <SearchInput
          placeholder="Search NFT"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="profile-widget__search-input"
        />
        <div className="profile-widget__collections">
          <div className="profile-widget__nfts-container">
            {filteredTokens.map((nft) => {
              const tokenOrder = orders.find(order => +order.signer.id === nft.id);
              const price = (tokenOrder && currencyTokenInfo) ? getFullOrderReadableSenderAmountPlusTotalFees(tokenOrder, currencyTokenInfo) : undefined;

              return (
                <NftCard
                  key={nft.id}
                  imageURI={nft.image}
                  name={nft.name}
                  price={price}
                  to={`/${AppRoutes.nftDetail}/${nft.id}`}
                  symbol={currencyTokenInfo?.symbol}
                  className="profile-widget__nft-card"
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedProfileWidget;
