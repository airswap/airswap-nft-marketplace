import React, { FC } from 'react';

import { routes } from '../../../../routes';
import IconNavLink from '../../../IconNavLink/IconNavLink';

import './DisconnectedOrderDetailHeader.scss';

interface DisconnectedOrderDetailHeaderProps {
  nftId?: number;
  title: string;
  className?: string;
}

const DisconnectedOrderDetailHeader: FC<DisconnectedOrderDetailHeaderProps> = ({ nftId, title, className = '' }) => (
  <div className={`buy-nft-widget-header ${className}`}>
    <h1 className="buy-nft-widget-header__title">{title}</h1>
    <IconNavLink
      hideLabel
      icon="close"
      text="Back"
      to={nftId ? routes.nftDetail(nftId) : routes.collection()}
      className="buy-nft-widget-header__back-button"
    />
  </div>
);

export default DisconnectedOrderDetailHeader;
