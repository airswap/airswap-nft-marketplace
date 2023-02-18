import React, { FC } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

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
      // must remove the hardcoded value before to raise the pr
        backgroundImage={collectionImage || 'collection/collection-example-image.png'}
        avatarUrl={avatarUrl}
        ensAddress={ensAddress}
        address={account || ''}
        onLogoutButtonClick={handleDisconnectClick}
      />
    </div>
  );
};

export default ProfileWidget;
