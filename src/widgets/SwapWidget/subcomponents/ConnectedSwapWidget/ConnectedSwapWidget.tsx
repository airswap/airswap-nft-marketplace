import React, { FC } from 'react';

import { Web3Provider } from '@ethersproject/providers';

import ActionButtons from '../ActionButtons/ActionButtons';

interface ConnectedSwapWidgetProps {
  account: string;
  library: Web3Provider
  className?: string;
}

const ConnectedSwapWidget: FC<ConnectedSwapWidgetProps> = ({ account, library, className = '' }) => (
  <div className={`connected-swap-widget ${className}`}>
    {account}
    {library.connection.url}
    <ActionButtons />
  </div>
);

export default ConnectedSwapWidget;
