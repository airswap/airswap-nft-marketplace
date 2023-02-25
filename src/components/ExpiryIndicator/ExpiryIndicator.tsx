import React, { FC } from 'react';

import './ExpiryIndicator.scss';

interface ExpiryIndicatorProps {
  unit: string;
  amount: number;
  className?: string;
}

const ExpiryIndicator: FC<ExpiryIndicatorProps> = ({ unit, amount, className = '' }) => (
  <div className={`expiry-indicator ${className}`}>
    <div className="expiry-indicator__title">
      Expires in
    </div>
    <div className="expiry-indicator__amount">
      {amount}
    </div>
    <div className="expiry-indicator__unit">
      {unit}
    </div>
  </div>
);

export default ExpiryIndicator;
