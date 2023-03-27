import React, { FC } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import Button from '../../components/Button/Button';
import useEnsAddress from '../../hooks/useEnsAddress';
import { useAppSelector } from '../../redux/hooks';
import ProfileHeader from './subcomponents/ProfileHeader/ProfileHeader';

import './ProfileWidget.scss';

const ProfileWidget: FC = () => {
  const { collectionImage } = useAppSelector((state) => state.config);
  const { account, deactivate } = useWeb3React<Web3Provider>();
  const ensAddress = useEnsAddress(account || '');
  const { avatarUrl } = useAppSelector((state) => state.user);

  const handleDisconnectClick = () => {
    deactivate();
  };

  return (
    <div className="profile-widget">
      <ProfileHeader
        backgroundImage={collectionImage}
        avatarUrl={avatarUrl}
        ensAddress={ensAddress}
        address={account || ''}
        onLogoutButtonClick={handleDisconnectClick}
      />
      <div className="profile-widget__button-group-container">
        <div className="profile-widget__button-group">
          <Button text="NFTs" className="profile-widget__button-group__button profile-widget__button-group__button--is-active" />
          <Button text="ACTIVITY" className="profile-widget__button-group__button" />
          <Button text="LISTED" className="profile-widget__button-group__button" />
        </div>
      </div>
    </div>
  );
};

export default ProfileWidget;
