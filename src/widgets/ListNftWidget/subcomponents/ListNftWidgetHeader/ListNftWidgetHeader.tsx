import React, { FC } from 'react';

import IconNavLink from '../../../../compositions/IconNavLink/IconNavLink';
import { AppRoutes } from '../../../../routes';

import './ListNftWidgetHeader.scss';

interface ListNftWidgetHeaderProps {
  title: string;
  className?: string;
}

const ListNftWidgetHeader: FC<ListNftWidgetHeaderProps> = ({ title, className = '' }) => (
  <div className={`list-nft-widget-header ${className}`}>
    <h1 className="list-nft-widget-header__title">{title}</h1>
    <IconNavLink
      hideLabel
      icon="close"
      text="Back"
      to={`/${AppRoutes.nftDetail}`}
      className="list-nft-widget-header__back-button"
    />
  </div>
);

export default ListNftWidgetHeader;
