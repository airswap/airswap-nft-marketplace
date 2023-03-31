import React, { FC, useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useParams } from 'react-router-dom';

import Accordion from '../../components/Accordion/Accordion';
import Button from '../../components/Button/Button';
import { IconSearch } from '../../components/Icon/icons';
import Input from '../../components/Input/Input';
import NftCard from '../../components/NftCard/NftCard';
import { CollectionToken } from '../../entities/CollectionToken/CollectionToken';
import useEnsAddress from '../../hooks/useEnsAddress';
import { useAppSelector } from '../../redux/hooks';
import { AppRoutes } from '../../routes';
import ProfileHeader from './subcomponents/ProfileHeader/ProfileHeader';
import ownedNfts from './temp-owned-nfts';

import './ProfileWidget.scss';

const filterNftsBySearchValue = (sValue: string, toFilter: CollectionToken[]) => {
  // If the search query is empty return all nfts
  if (sValue === '') return toFilter;
  const filteredNfts: CollectionToken[] = [];
  // We can search by id, name, description & attribute values.
  for (let i = 0; i < toFilter.length; i += 1) {
    const nft = toFilter[i];
    if (nft.name.toLowerCase().includes(sValue.toLowerCase())) {
      filteredNfts.push(nft);
    }
    if (nft.description.toLowerCase().includes(sValue.toLowerCase())) {
      filteredNfts.push(nft);
    }
    if (nft.id.toString().toLowerCase().includes(sValue.toLowerCase())) {
      filteredNfts.push(nft);
    }
    if (nft.attributes) {
      for (let j = 0; j < nft.attributes.length; j += 1) {
        const attribute = nft.attributes[j];
        if (attribute.value.toString().toLowerCase().includes(sValue.toLowerCase())) {
          filteredNfts.push(nft);
        }
      }
    }
  }
  // Remove duplicates
  const uniqueNfts = filteredNfts.filter((nft, index) => filteredNfts.indexOf(nft) === index);
  return uniqueNfts;
};

const ProfileWidget: FC = () => {
  const [searchValue, setSearchValue] = useState('');
  // If there is a user active, then we need to check the id param to see if it's the same as the acccount
  const { active, account, deactivate } = useWeb3React<Web3Provider>();
  // If there is no id param, then we should display the current user's profile
  const { id } = useParams();
  const isPrivateProfile = !id || id === account;

  const { collectionImage, collectionName } = useAppSelector((state) => state.config);
  const { avatarUrl } = useAppSelector((state) => state.user);
  const { isLoading, balances, tokenIds } = useAppSelector((state) => state.balances);
  const ensAddress = useEnsAddress(account || '');

  useEffect(() => {
    console.log('ProfileWidget - balances: ', balances);
    console.log('ProfileWidget - tokenIds: ', tokenIds);
  }, [balances, tokenIds, isLoading]);

  const handleDisconnectClick = () => {
    deactivate();
  };

  if (false) {
    console.log('ProfileWidget - Wallet connected: ', active ? 'Yes' : 'No');
    console.log('ProfileWidget - isPrivate Profile: ', isPrivateProfile ? 'Yes' : 'No');
    console.log('ProfileWidget - ownedNfts: ', ownedNfts);
  }

  return (
    <div className="profile-widget">
      <ProfileHeader
        avatarUrl={avatarUrl}
        backgroundImage={collectionImage}
        ensAddress={ensAddress}
        address={account || ''}
        onLogoutButtonClick={handleDisconnectClick}
      />
      <div className="profile-widget__button-group-container">
        <div className="profile-widget__button-group">
          <Button text="NFTs" className="profile-widget__button-group__button profile-widget__button-group__button--is-active" />
          <Button text="ACTIVITY" className="profile-widget__button-group__button" disabled />
          <Button text="LISTED" className="profile-widget__button-group__button" disabled />
        </div>
      </div>
      <div className="profile-widget__content">
        <div className="profile-widget__search-bar-container">
          <i className="profile-widget__search-bar-icon">
            <IconSearch />
          </i>
          <Input className="profile-widget__search-bar" placeholder="Search NFT" onChange={e => setSearchValue(e.target.value)} />
        </div>
        <div className="profile-widget__collections">
          <Accordion
            label={collectionName}
            content={(
              <div className="profile-widget__nfts-container">
                {filterNftsBySearchValue(searchValue, ownedNfts).map((nft) => (
                  <NftCard
                    key={nft.id}
                    imageURI={nft.image}
                    name={nft.name}
                    price={nft.price.toString()}
                    to={`/${AppRoutes.nftDetail}/${nft.id}`}
                    className="profile-widget__nft-card"
                    symbol={nft.symbol || 'AST'} // TODO: remove the backup symbol
                  />
                ))}
              </div>
            )}
            isDefaultOpen
          />

        </div>
      </div>
    </div>
  );
};

export default ProfileWidget;
