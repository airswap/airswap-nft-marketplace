import React, { FC } from 'react';

import { routes } from '../../routes';
import IconNavLink from '../IconNavLink/IconNavLink';

import './OrderWidgetHeader.scss';

interface OrderWidgetHeaderProps {
  nftId?: string;
  title: string;
  className?: string;
}

const OrderWidgetHeader: FC<OrderWidgetHeaderProps> = ({ nftId, title, className = '' }) => (
  <div className={`order-widget-header ${className}`}>
    <h1 className="order-widget-header__title">{title}</h1>
    <IconNavLink
      hideLabel
      icon="close"
      text="Back"
      to={nftId ? routes.nftDetail(nftId) : routes.collection()}
      className="order-widget-header__back-button"
    />
  </div>
);

export default OrderWidgetHeader;
