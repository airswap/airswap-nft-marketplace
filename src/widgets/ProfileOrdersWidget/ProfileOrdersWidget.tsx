import { FC } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../redux/hooks';
import DisconnectedProfileWidget
  from '../ProfileWidget/subcomponents/DisconnectedProfileWidget/DisconnectedProfileWidget';
import ConnectedProfileOrdersWidget from './subcomponents/ConnectedProfileOrdersWidget/ConnectedProfileOrdersWidget';

import './ProfileOrdersWidget.scss';

const ProfileOrdersWidget: FC = () => {
  const { account } = useWeb3React<Web3Provider>();
  const { account: profileAccount } = useParams();

  const { isInitialized } = useAppSelector((state) => state.indexer);
  const { currencyTokenInfo } = useAppSelector((state) => state.metadata);

  if (
    isInitialized
    && account
    && currencyTokenInfo
    && profileAccount
  ) {
    return (
      <ConnectedProfileOrdersWidget
        currencyTokenInfo={currencyTokenInfo}
        profileAccount={profileAccount}
      />
    );
  }

  return (
    <DisconnectedProfileWidget
      profileAccount={profileAccount}
    />
  );
};

export default ProfileOrdersWidget;
