import React, { FC, ReactElement } from 'react';

import './ExpiryDateInfo.scss';

interface ExpiryDateInfoProps {
  expiry: Date;
  className?: string;
}

const ExpiryDateInfo: FC<ExpiryDateInfoProps> = ({ expiry, className = '' }): ReactElement => (
  <div className={`expiry-date-info ${className}`}>
    <div className="expiry-date-info__title">
      Expires on
    </div>
    <div className="expiry-date-info__date">
      {expiry.toLocaleString()}
    </div>
  </div>
);

export default ExpiryDateInfo;
