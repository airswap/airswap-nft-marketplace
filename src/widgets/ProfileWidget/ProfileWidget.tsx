import React, { FC } from 'react';

import { useWeb3React } from '@web3-react/core';

import ConnectedProfileWidget from './subcomponents/ConnectedProfileWidget/ConnectedProfileWidget';
import DisconnectedProfileWidget from './subcomponents/DisconnectedProfileWidget/DisconnectedProfileWidget';

import './ProfileWidget.scss';

interface ProfileWidgetProps {
  className?: string;
}

const ProfileWidget: FC<ProfileWidgetProps> = ({ className = '' }) => {
  const { library } = useWeb3React();

  if (library) {
    return (
      <ConnectedProfileWidget
        library={library}
        className={className}
      />
    );
  }
  return <DisconnectedProfileWidget className={className} />;
};

export default ProfileWidget;
