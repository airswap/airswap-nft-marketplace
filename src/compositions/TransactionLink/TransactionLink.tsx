import React, { FC } from 'react';

import { NavLinkProps } from 'react-router-dom';

import IconNavLink from '../IconNavLink/IconNavLink';

import './TransactionLink.scss';

interface TransactionLinkProps extends NavLinkProps {
  hideLabel?: boolean;
  className?: string;
}

const TransactionLink: FC<TransactionLinkProps> = ({ hideLabel, className = '', ...props }) => (
  <IconNavLink
    {...props}
    hideLabel={hideLabel}
    target="_blank"
    icon="transaction-link"
    iconAlign="right"
    text="View on Etherscan"
    className={`transaction-link ${className}`}
  />
);

export default TransactionLink;
