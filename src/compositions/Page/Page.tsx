import React, { FC, ReactNode } from 'react';

import WalletConnector from '../../widgets/WalletConnector/WalletConnector';

import './Page.scss';

interface PageProps {
  children?: ReactNode;
}

const Page: FC<PageProps> = ({ children }) => (
  <div className="page">
    {/* top menu here */}
    {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
    <WalletConnector afterProviderSelect={() => {}} />
    {children}
  </div>
);

export default Page;
