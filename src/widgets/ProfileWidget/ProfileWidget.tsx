import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useParams } from 'react-router-dom';

import Button from '../../components/Button/Button';
import NftCard from '../../components/NftCard/NftCard';
import SearchInput from '../../components/SearchInput/SearchInput';
import { filterCollectionTokenBySearchValue } from '../../entities/CollectionToken/CollectionTokenHelpers';
import { getFullOrderReadableSenderAmountPlusTotalFees } from '../../entities/FullOrder/FullOrderHelpers';
import useCollectionTokens from '../../hooks/useCollectionTokens';
import useEnsAddress from '../../hooks/useEnsAddress';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getProfileOrders } from '../../redux/stores/profile/profileApi';
import { AppRoutes } from '../../routes';
import ProfileHeader from './subcomponents/ProfileHeader/ProfileHeader';

import './ProfileWidget.scss';

interface ProfileWidgetProps {
  className?: string;
}

const ProfileWidget: FC<ProfileWidgetProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();

  const { account, deactivate } = useWeb3React<Web3Provider>();
  const { account: paramsAccount } = useParams();

  const { isInitialized } = useAppSelector((state) => state.indexer);
  const { collectionToken, collectionImage } = useAppSelector((state) => state.config);
  const { avatarUrl } = useAppSelector((state) => state.user);
  const { tokens: ownedTokenIds } = useAppSelector((state) => state.balances);
  const { currencyTokenInfo } = useAppSelector((state) => state.metadata);
  const { orders } = useAppSelector((state) => state.profile);

  const [searchValue, setSearchValue] = useState('');
  const ensAddress = useEnsAddress(account || '');
  const [tokens] = useCollectionTokens(collectionToken, ownedTokenIds);
  const filteredTokens = useMemo(() => (
    tokens.filter(nft => filterCollectionTokenBySearchValue(nft, searchValue))
  ), [tokens, searchValue]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    dispatch(getProfileOrders({
      signerTokens: [collectionToken],
      signerWallet: paramsAccount,
      offset: 0,
      limit: 9999,
    }));
  }, [isInitialized]);

  const handleDisconnectClick = () => {
    deactivate();
  };

  return (
    <div className={`profile-widget ${className}`}>
      <ProfileHeader
        avatarUrl={avatarUrl}
        backgroundImage={collectionImage}
        ensAddress={ensAddress}
        address={account || ''}
        showLogOutButton={account === paramsAccount}
        onLogoutButtonClick={handleDisconnectClick}
      />
      <div className="profile-widget__button-group-container">
        <div className="profile-widget__button-group">
          <Button text="NFTs" className="profile-widget__button-group__button profile-widget__button-group__button--is-active" />
          <Button text="Activity" className="profile-widget__button-group__button profile-widget__button-group__button--is-uppercase" disabled />
          <Button text="Listed" className="profile-widget__button-group__button profile-widget__button-group__button--is-uppercase" disabled />
        </div>
      </div>
      <div className="profile-widget__content">
        <SearchInput
          placeholder="Search NFT"
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
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

export default ProfileWidget;
