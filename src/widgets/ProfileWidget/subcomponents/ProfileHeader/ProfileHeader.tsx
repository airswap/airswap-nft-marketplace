import React, { FC } from 'react';

import WalletInfo from '../../../../components/WalletInfo/WalletInfo';
import ProfileNavigation from '../ProfileNavigation/ProfileNavigation';

import './ProfileHeader.scss';

interface ProfileHeaderProp {
  accountUrl?: string;
  avatarUrl?: string;
  address?: string;
  backgroundImage?: string;
  ensAddress?: string;
  className?: string;
}

const ProfileHeader: FC<ProfileHeaderProp> = ({
  accountUrl,
  avatarUrl,
  ensAddress,
  address,
  backgroundImage,
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
