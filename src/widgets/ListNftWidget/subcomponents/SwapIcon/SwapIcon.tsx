import React, { FC } from 'react';

import Icon from '../../../../components/Icon/Icon';

import './SwapIcon.scss';

interface SwapIconProps {
  className?: string;
}

const SwapIcon: FC<SwapIconProps> = ({ className = '' }) => (
  <div className={`swap-icon ${className}`}>
    <Icon className="swap-icon__icon" name="swap" />
  </div>
);

export default SwapIcon;
