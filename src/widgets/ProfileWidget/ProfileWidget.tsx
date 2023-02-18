import React, { FC } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import useEnsAddress from '../../hooks/useEnsAddress';
import { useAppSelector } from '../../redux/hooks';
import ProfileHeader from './subcomponents/ProfileHeader/ProfileHeader';

import './ProfileWidget.scss';

const ProfileWidget: FC = () => {
  const { account } = useWeb3React<Web3Provider>();
  const ensAddress = useEnsAddress(account || '');
  const { avatarUrl } = useAppSelector((state) => state.user);

  return (
    <div className="profile-widget">
      <ProfileHeader avatarUrl={avatarUrl} ensAddress={ensAddress} address={account || ''} />
    </div>
  );
};

export default ProfileWidget;
