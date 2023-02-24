import React, { FC } from 'react';

import { NavLinkProps } from 'react-router-dom';

import IconNavLink from '../IconNavLink/IconNavLink';

import './TransactionLink.scss';

interface TransactionLinkProps extends NavLinkProps {
  className?: string;
}

const TransactionLink: FC<TransactionLinkProps> = ({ className = '', ...props }) => (
  <IconNavLink
    {...props}
    icon="transaction-link"
    iconAlign="right"
    text="View on Etherscan"
    className={`transaction-link ${className}`}
  />
);

export default TransactionLink;
