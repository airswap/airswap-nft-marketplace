import React, { FC, ReactElement, useMemo } from 'react';

import './ExpiryDateInfo.scss';

interface ExpiryDateInfoProps {
  expiry: Date;
  className?: string;
}

const ExpiryDateInfo: FC<ExpiryDateInfoProps> = ({ expiry, className = '' }): ReactElement => {
  const readableDate = useMemo(() => `${expiry.toLocaleDateString()} ${expiry.getHours()}:${expiry.getMinutes()}`, [expiry]);

  return (
    <div className={`expiry-date-info ${className}`}>
      <div className="expiry-date-info__title">
        Expires on
      </div>
      <div className="expiry-date-info__date">
        {readableDate}
      </div>
    </div>
  );
};

export default ExpiryDateInfo;
