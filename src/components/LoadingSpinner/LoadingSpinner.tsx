import React, { FC } from 'react';

import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ className = '' }) => (
  <div className={`loading-spinner ${className}`}>
    <svg className="loading-spinner__svg" viewBox="0 0 26 26">
      <circle cx="13" cy="13" r="12" />
    </svg>
  </div>
);

export default LoadingSpinner;
