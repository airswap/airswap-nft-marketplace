import React, { FC } from 'react';

import WalletInfo from '../../../../components/WalletInfo/WalletInfo';

import './ProfileHeader.scss';

interface ProfileHeaderProp {
  avatarUrl?: string;
  address?: string;
  ensAddress?: string;
  backgroundImage?: string;
  showLogOutButton?: boolean;
  onLogoutButtonClick: () => void;
  className?: string;
}

const ProfileHeader: FC<ProfileHeaderProp> = ({
  avatarUrl,
  ensAddress,
  address,
  backgroundImage,
  showLogOutButton = false,
  onLogoutButtonClick,
  className = '',
}) => (
  <div className={`profile-header ${className}`} style={{ backgroundImage: `url("${backgroundImage}")` }}>
    <WalletInfo
      isBanner
      avatarUrl={avatarUrl}
      ensAddress={ensAddress}
      address={address}
      showLogOutButton={showLogOutButton}
      onLogoutButtonClick={onLogoutButtonClick}
      className="profile-header__wallet-info"
    />
  </div>
);


export default ProfileHeader;
