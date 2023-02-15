import React, { FC } from 'react';

import IconNavLink from '../../../../compositions/IconNavLink/IconNavLink';
import { AppRoutes } from '../../../../routes';

import './BuyNftWidgetHeader.scss';

interface BuyNftWidgetHeaderProps {
  title: string;
  className?: string;
}

const BuyNftWidgetHeader: FC<BuyNftWidgetHeaderProps> = ({ title, className = '' }) => (
  <div className={`buy-nft-widget-header ${className}`}>
    <h1 className="buy-nft-widget-header__title">{title}</h1>
    <IconNavLink
      hideLabel
      icon="close"
      text="Back"
      to={`${AppRoutes.nftDetail}`}
      className="buy-nft-widget-header__back-button"
    />
  </div>
);

export default BuyNftWidgetHeader;
