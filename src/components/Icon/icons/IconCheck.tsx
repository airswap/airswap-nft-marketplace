import React, { FC, ReactElement } from 'react';

import { SvgIconProps } from '../Icon';

const IconCheck: FC<SvgIconProps> = ({ className = '' }): ReactElement => (
  <svg fill="none" viewBox="0 0 14 11" className={className}>
    <path d="M4.95703 10.9993L0.207031 6.24935L1.39453 5.06185L4.95703 8.62435L12.6029 0.978516L13.7904 2.16602L4.95703 10.9993Z" />
  </svg>
);

export default IconCheck;
