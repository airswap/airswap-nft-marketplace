import React, { FC, PropsWithChildren } from 'react';

import WalletConnector from '../../widgets/WalletConnector/WalletConnector';

const Page: FC<PropsWithChildren> = ({ children }) => (
  <div className="page">
    {/* top menu here */}
    {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
    <WalletConnector afterProviderSelect={() => {}} />
    {children}
  </div>
);

export default Page;
