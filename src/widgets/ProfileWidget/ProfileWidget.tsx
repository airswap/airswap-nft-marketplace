import React, { FC } from 'react';

import { useWeb3React } from '@web3-react/core';
import { useParams } from 'react-router-dom';

import ProfileHeader from './subcomponents/ProfileHeader/ProfileHeader';

import './ProfileWidget.scss';

const ProfileWidget: FC = () => {
  // If there is a user active, then we need to check the id param to see if it's the same as the acccount
  const { active, account } = useWeb3React();
  // If there is no id param, then we should display the current user's profile
  const { id } = useParams();
  const isPrivateProfile = !id || id === account;


  console.log('ProfileWidget - Wallet connected: ', active ? 'Yes' : 'No');
  console.log('ProfileWidget - isPrivate Profile: ', isPrivateProfile ? 'Yes' : 'No');
  return (
    <div className="profile-widget">
      <ProfileHeader
        avatarUrl="https://ychef.files.bbci.co.uk/976x549/p0dnxrcv.jpg"
        onLogoutButtonClick={() => console.log('logout')}
        backgroundImage="https://ychef.files.bbci.co.uk/976x549/p0dnxrcv.jpg"
      />
    </div>
  );
};

export default ProfileWidget;
