import { FC } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../redux/hooks';
import ConnectedProfileWidget from './subcomponents/ConnectedProfileWidget/ConnectedProfileWidget';
import DisconnectedProfileWidget from './subcomponents/DisconnectedProfileWidget/DisconnectedProfileWidget';

import './ProfileWidget.scss';

const ProfileWidget: FC = () => {
  const { account, provider: library } = useWeb3React<Web3Provider>();
  const { account: profileAccount } = useParams();

  const { isInitialized } = useAppSelector((state) => state.indexer);
  const { currencyTokenInfo } = useAppSelector((state) => state.metadata);

  if (
    isInitialized
    && account
    && currencyTokenInfo
    && library
    && profileAccount
  ) {
    return (
      <ConnectedProfileWidget
        currencyTokenInfo={currencyTokenInfo}
        library={library}
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

export default ProfileWidget;
