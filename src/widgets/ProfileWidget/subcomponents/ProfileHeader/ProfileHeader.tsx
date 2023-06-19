import React, { FC } from 'react';

import WalletInfo from '../../../../components/WalletInfo/WalletInfo';
import ProfileNavigation from '../ProfileNavigation/ProfileNavigation';

import './ProfileHeader.scss';

interface ProfileHeaderProp {
  showLogOutButton?: boolean;
  accountUrl?: string;
  avatarUrl?: string;
  address?: string;
  backgroundImage?: string;
  ensAddress?: string;
  onLogoutButtonClick?: () => void;
  className?: string;
}

const ProfileHeader: FC<ProfileHeaderProp> = ({
  accountUrl,
  avatarUrl,
  ensAddress,
  address,
  backgroundImage,
  showLogOutButton = false,
  onLogoutButtonClick,
  className = '',
}) => (
  <div
    className={`profile-header ${className}`}
  >
    <div
      style={{ backgroundImage: `url("${backgroundImage}")` }}
      className="profile-header__portrait"
    >
      <WalletInfo
        isBanner
        accountUrl={accountUrl}
        avatarUrl={avatarUrl}
        ensAddress={ensAddress}
        address={address}
        showLogOutButton={showLogOutButton}
        onLogoutButtonClick={onLogoutButtonClick}
        className="profile-header__wallet-info"
      />
    </div>

    <div className="profile-header__navigation-container">
      {address && (
        <ProfileNavigation
          account={address}
          className="profile-header__navigation"
        />
      )}
    </div>
  </div>
);


export default ProfileHeader;
