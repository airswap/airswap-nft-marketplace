import { FC } from 'react';

import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../redux/hooks';
import DisconnectedProfileWidget
  from '../ProfileWidget/subcomponents/DisconnectedProfileWidget/DisconnectedProfileWidget';
import ConnectedProfileOrdersWidget from './subcomponents/ConnectedProfileOrdersWidget/ConnectedProfileOrdersWidget';

import './ProfileOrdersWidget.scss';

const ProfileOrdersWidget: FC = () => {
  const { account: profileAccount } = useParams();

  const { account } = useAppSelector((state) => state.web3);
  const { isInitialized } = useAppSelector((state) => state.indexer);
  const { currencyTokenInfo } = useAppSelector((state) => state.metadata);

  if (
    isInitialized
    && currencyTokenInfo
    && profileAccount
  ) {
    return (
      <ConnectedProfileOrdersWidget
        account={account}
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
