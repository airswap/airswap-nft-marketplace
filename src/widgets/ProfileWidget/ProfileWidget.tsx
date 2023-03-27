import React, { FC } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useParams } from 'react-router-dom';

import Accordion from '../../components/Accordion/Accordion';
import Button from '../../components/Button/Button';
import { IconSearch } from '../../components/Icon/icons';
import Input from '../../components/Input/Input';
import NftCard from '../../components/NftCard/NftCard';
import useEnsAddress from '../../hooks/useEnsAddress';
import { useAppSelector } from '../../redux/hooks';
import { AppRoutes } from '../../routes';
import ProfileHeader from './subcomponents/ProfileHeader/ProfileHeader';
import ownedNfts from './temp-owned-nfts';

import './ProfileWidget.scss';

const ProfileWidget: FC = () => {
  // If there is a user active, then we need to check the id param to see if it's the same as the acccount
  const { active, account, deactivate } = useWeb3React<Web3Provider>();
  // If there is no id param, then we should display the current user's profile
  const { id } = useParams();
  const isPrivateProfile = !id || id === account;

  const { collectionImage } = useAppSelector((state) => state.config);
  const ensAddress = useEnsAddress(account || '');
  const { avatarUrl } = useAppSelector((state) => state.user);

  const handleDisconnectClick = () => {
    deactivate();
  };

  console.log('ProfileWidget - Wallet connected: ', active ? 'Yes' : 'No');
  console.log('ProfileWidget - isPrivate Profile: ', isPrivateProfile ? 'Yes' : 'No');
  console.log('ProfileWidget - ownedNfts: ', ownedNfts);

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
          <Input className="profile-widget__search-bar" placeholder="Search NFT" />
        </div>
        <div className="profile-widget__collections">
          <Accordion
            label="Dark Blue Collection"
            content={(
              <div className="profile-widget__nfts-container">
                {ownedNfts.map((nft) => (
                  <NftCard
                    key={nft.id}
                    imageURI={nft.image}
                    name={nft.name}
                    price={nft.price.toString()}
                    to={`${AppRoutes.nftDetail}/${nft.id}`}
                    className="profile-widget__nft-card"
                    symbol={nft.symbol || 'AST'} // TODO: remove the backup symbol
                  />
                ))}
              </div>
            )}
          />

        </div>
      </div>
    </div>
  );
};

export default ProfileWidget;
