import React, { FC, ReactNode } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import WalletConnector from '../../widgets/WalletConnector/WalletConnector';
import TopBar from '../TopBar/TopBar';

import './Page.scss';

interface PageProps {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}

const Page: FC<PageProps> = ({ className = '', contentClassName = '', children }) => {
  const { active } = useWeb3React<Web3Provider>();

  return (
    <div className={`page ${className}`}>
      <TopBar />
      {!active && <WalletConnector className="page__wallet-connector" />}

      <div className={`page__content ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Page;
