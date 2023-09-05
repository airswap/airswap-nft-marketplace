import { FC, ReactElement } from 'react';

import { NavLink } from 'react-router-dom';

import './EmptyState.scss';

interface EmptyStateProps {
  hasButton?: boolean;
  buttonText?: string;
  route?: string;
  text?: string;
  className?: string;
}

const EmptyState: FC<EmptyStateProps> = ({
  hasButton = false,
  buttonText,
  route,
  text,
  className = '',
}): ReactElement => (
  <div className={`empty-state ${className}`}>
    {text && (
      <p className="empty-state__text">
        {text}
      </p>
    )}
    {(hasButton && route) && (
      <NavLink
        to={route}
        className="empty-state__link"
      >
        {buttonText}
      </NavLink>
    )}
  </div>
);

export default EmptyState;
