import React, { FC, PropsWithChildren } from 'react';

const Page: FC<PropsWithChildren> = ({ children }) => (
  <div className="page">
    {/* top menu here */}
    {children}
  </div>
);

export default Page;
