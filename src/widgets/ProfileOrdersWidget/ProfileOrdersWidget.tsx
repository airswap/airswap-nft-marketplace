import { FC } from 'react';

import { useParams } from 'react-router-dom';

import useDefaultProvider from '../../hooks/useDefaultProvider';
import { useAppSelector } from '../../redux/hooks';
import DisconnectedProfileWidget
  from '../ProfileWidget/subcomponents/DisconnectedProfileWidget/DisconnectedProfileWidget';
import ConnectedProfileOrdersWidget from './subcomponents/ConnectedProfileOrdersWidget/ConnectedProfileOrdersWidget';

import './ProfileOrdersWidget.scss';

const ProfileOrdersWidget: FC = () => {
  const { account: profileAccount } = useParams();

  const { chainId } = useAppSelector((state) => state.config);
  const { account } = useAppSelector((state) => state.web3);
  const { isInitialized } = useAppSelector((state) => state.indexer);
  const { currencyTokenInfo } = useAppSelector((state) => state.metadata);

  const provider = useDefaultProvider(chainId);

  if (
    isInitialized
    && currencyTokenInfo
    && profileAccount
    && provider
  ) {
    return (
      <ConnectedProfileOrdersWidget
        account={account}
        currencyTokenInfo={currencyTokenInfo}
        profileAccount={profileAccount}
        provider={provider}
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
