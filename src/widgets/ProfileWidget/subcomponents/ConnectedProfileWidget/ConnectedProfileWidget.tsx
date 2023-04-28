import React, { FC, useEffect, useState } from 'react';

import { CollectionTokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useParams } from 'react-router-dom';

import Accordion from '../../../../components/Accordion/Accordion';
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

const filterNftsBySearchValue = (sValue: string, toFilter: CollectionTokenInfo[]) => {
  // If the search query is empty return all nfts
  if (sValue === '') return toFilter;
  const filteredNfts: CollectionTokenInfo[] = [];
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

  // If there is a user active, then we need to check the id param to see if it's the same as the acccount
  const { active, account, deactivate } = useWeb3React<Web3Provider>();
  // If there is no id param, then we should display the current user's profile
  const { id } = useParams();
  const isPrivateProfile = !id || id === account;

  const dispatch = useAppDispatch();
  const ensAddress = useEnsAddress(account || '');

  useEffect(() => {
    // console.log('ProfileWidget - balances: ', balances);
    // console.log('ProfileWidget - tokens: ', tokens);
    if (tokens) {
      dispatch(fetchOwnedTokenMeta({ library, collectionToken, tokenIds: tokens }));
    }
  }, [library, collectionToken, tokens]);

  useEffect(() => {
    if (ownedTokenMeta) {
      console.log('ProfileWidget - ownedTokenMeta: ', ownedTokenMeta);
      setOwnedNfts(ownedTokenMeta);
    }
  }, [ownedTokenMeta, isLoading]);

  const handleDisconnectClick = () => {
    deactivate();
  };

  if (false) {
    console.log('ProfileWidget - Wallet connected: ', active ? 'Yes' : 'No');
    console.log('ProfileWidget - isPrivate Profile: ', isPrivateProfile ? 'Yes' : 'No');
    // console.log('ProfileWidget - ownedNfts: ', ownedNfts);
  }

  return (
    <div className={`profile-widget ${className}`}>
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
                {ownedNfts && filterNftsBySearchValue(searchValue, ownedNfts).map((nft) => (
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
            )}
            isDefaultOpen
          />

        </div>
      </div>
    </div>
  );
};

export default ConnectedProfileWidget;
