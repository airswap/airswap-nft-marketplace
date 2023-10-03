import { FC } from 'react';

import { useParams } from 'react-router-dom';

import useDefaultLibrary from '../../hooks/useDefaultProvider';
import { useAppSelector } from '../../redux/hooks';
import ConnectedProfileWidget from './subcomponents/ConnectedProfileWidget/ConnectedProfileWidget';
import DisconnectedProfileWidget from './subcomponents/DisconnectedProfileWidget/DisconnectedProfileWidget';

import './ProfileWidget.scss';

const ProfileWidget: FC = () => {
  const { account: profileAccount } = useParams();

  const { chainId } = useAppSelector((state) => state.config);
  const { isInitialized } = useAppSelector((state) => state.indexer);
  const { currencyTokenInfo } = useAppSelector((state) => state.metadata);

  const library = useDefaultLibrary(chainId);

  if (
    isInitialized
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
