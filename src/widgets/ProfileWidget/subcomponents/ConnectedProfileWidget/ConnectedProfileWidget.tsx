import React, {
  FC, useEffect, useMemo, useState,
} from 'react';

import { CollectionTokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '../../../../components/Button/Button';
import { IconSearch } from '../../../../components/Icon/icons';
import Input from '../../../../components/Input/Input';
import NftCard from '../../../../components/NftCard/NftCard';
import useEnsAddress from '../../../../hooks/useEnsAddress';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchOwnedTokenMeta } from '../../../../redux/stores/profile/profileApi';
import { AppRoutes } from '../../../../routes';
import ProfileHeader from '../ProfileHeader/ProfileHeader';

import '../../ProfileWidget.scss';

const filterNftsBySearchValue = (sValue: string, nft: CollectionTokenInfo) => {
  // If the search query is empty keep the nft.
  if (sValue === '') return true;
  // We can search by id, name, description & attribute values.
  if (nft.name && nft.name.toLowerCase().includes(sValue.toLowerCase())) return true;
  if (nft.description && nft.description.toLowerCase().includes(sValue.toLowerCase())) return true;
  if (nft.id.toString().toLowerCase().includes(sValue.toLowerCase())) return true;
  if (nft.attributes) {
    for (let j = 0; j < nft.attributes.length; j += 1) {
      const attribute = nft.attributes[j];
      if (attribute.value.toString().toLowerCase().includes(sValue.toLowerCase())) return true;
    }
  }
  return false;
};

interface ConnectedProfileWidgetProps {
  library: Web3Provider;
  className?: string;
}

const ConnectedProfileWidget: FC<ConnectedProfileWidgetProps> = ({ library, className = '' }) => {
  const { collectionToken, collectionImage, collectionName } = useAppSelector((state) => state.config);
  const { avatarUrl } = useAppSelector((state) => state.user);
  const { tokens } = useAppSelector((state) => state.balances);
  const { isLoading, ownedTokenMeta } = useAppSelector((state) => state.profile);

  const [ownedNfts, setOwnedNfts] = useState<CollectionTokenInfo[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const { account, deactivate } = useWeb3React<Web3Provider>();
  const { id } = useParams();
  const navigate = useNavigate();
  // If there is no id param then we should navigate to the current user.
  // This is useful when the user logs out as we can continue to show them their profile.
  useEffect(() => {
    if (!id && account) {
      navigate(`/${AppRoutes.profile}/${account}`);
    }
  }, [id, account]);

  const dispatch = useAppDispatch();
  const ensAddress = useEnsAddress(account || '');

  const filteredNfts = useMemo(() => ownedNfts.filter(nft => filterNftsBySearchValue(searchValue, nft)), [ownedNfts, searchValue]);

  useEffect(() => {
    if (tokens) {
      // TODO: support loading the tokens of other users
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
        address={id || account || ''}
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
        <div className="profile-widget__search-bar-container">
          <IconSearch className="profile-widget__search-bar-icon" />
          <Input className="profile-widget__search-bar" placeholder="Search NFT" onChange={e => setSearchValue(e.target.value)} />
        </div>
        <div className="profile-widget__collections">
          <p className="profile-widget__collections-title">{collectionName}</p>
          <div className="profile-widget__nfts-container">
            {filteredNfts.map((nft) => (
              <NftCard
                key={nft.id}
                imageURI={nft.image}
                name={nft.name}
                price="12345"
                to={`/${AppRoutes.nftDetail}/${nft.id}`}
                className="profile-widget__nft-card"
                symbol="AST" // TODO: remove the backup symbol
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedProfileWidget;
