import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CollectionTokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useParams } from 'react-router-dom';

import Button from '../../components/Button/Button';
// import { IconSearch } from '../../components/Icon/icons';
// import Input from '../../components/Input/Input';
import NftCard from '../../components/NftCard/NftCard';
import SearchInput from '../../components/SearchInput/SearchInput';
import filterNftBySearchValue from '../../helpers/filterNftBySearchValue';
import useEnsAddress from '../../hooks/useEnsAddress';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchOwnedTokenMeta } from '../../redux/stores/profile/profileApi';
import { AppRoutes } from '../../routes';
import ProfileHeader from './subcomponents/ProfileHeader/ProfileHeader';

import './ProfileWidget.scss';

interface ProfileWidgetProps {
  className?: string;
}

const ProfileWidget: FC<ProfileWidgetProps> = ({ className = '' }) => {
  const { collectionToken, collectionImage } = useAppSelector((state) => state.config);
  const { avatarUrl } = useAppSelector((state) => state.user);
  const { tokens } = useAppSelector((state) => state.balances);
  const { isLoading, ownedTokenMeta } = useAppSelector((state) => state.profile);
  const { currencyTokenInfo } = useAppSelector((state) => state.metadata);

  const [ownedNfts, setOwnedNfts] = useState<CollectionTokenInfo[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const { library, account, deactivate } = useWeb3React<Web3Provider>();
  const { account: accountId } = useParams();

  const dispatch = useAppDispatch();
  const ensAddress = useEnsAddress(account || '');

  const filteredNfts = useMemo(() => ownedNfts.filter(nft => filterNftBySearchValue(searchValue, nft)), [ownedNfts, searchValue]);

  useEffect(() => {
    // TODO: support loading the tokens of other users
    if (tokens && library) {
      dispatch(fetchOwnedTokenMeta({ library, collectionToken, tokenIds: tokens }));
    }
  }, [library, collectionToken, tokens]);

  useEffect(() => {
    if (ownedTokenMeta) {
      setOwnedNfts(ownedTokenMeta);
    }
  }, [ownedTokenMeta, isLoading]);

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
        showLogOutButton={account === accountId}
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
            {filteredNfts.map((nft) => (
              <NftCard
                key={nft.id}
                imageURI={nft.image}
                name={nft.name}
                price="12345"
                to={`/${AppRoutes.nftDetail}/${nft.id}`}
                symbol={currencyTokenInfo?.symbol}
                className="profile-widget__nft-card"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileWidget;
