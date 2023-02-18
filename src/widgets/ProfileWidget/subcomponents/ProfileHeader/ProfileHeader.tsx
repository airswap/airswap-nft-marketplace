import React, { FC } from 'react';

import WalletInfo from '../../../../components/WalletInfo/WalletInfo';

import './ProfileHeader.scss';

interface ProfileHeaderProp {
  avatarUrl?: string;
  address?: string;
  ensAddress?: string;
  className?: string;
}

const ProfileHeader: FC<ProfileHeaderProp> = ({
  avatarUrl,
  ensAddress,
  address,
  className = '',
}) => {
  const handleDisconnectClick = () => {
    console.log('handleDisconnectClick');
  };
  return (
    <div className={className}>
      <WalletInfo isBanner avatarUrl={avatarUrl} ensAddress={ensAddress} address={address} onLogoutButtonClick={handleDisconnectClick} />
    </div>
  );
};


export default ProfileHeader;
