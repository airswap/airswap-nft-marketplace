import React, { FC } from 'react';

import { useWeb3React } from '@web3-react/core';

import ConnectedNftDetailWidget from './subcomponents/ConnectedNftDetailWidget/ConnectedNftDetailWidget';
import DisconnectedNftDetailWidget from './subcomponents/DisconnectedNftDetailWidget/DisconnectedNftDetailWidget';

import './NftDetailWidget.scss';

interface NftDetailWidgetProps {
  className?: string;
}

const NftDetailWidget: FC<NftDetailWidgetProps> = ({ className = '' }) => {
  const { library } = useWeb3React();

  if (library) {
    return (
      <ConnectedNftDetailWidget
        library={library}
        className={className}
      />
    );
  }
  return <DisconnectedNftDetailWidget className={className} />;
};

export default NftDetailWidget;
