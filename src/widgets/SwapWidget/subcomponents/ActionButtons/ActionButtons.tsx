import React, { FC } from 'react';

interface ActionButtonProps {
  className?: string;
}

const ActionButton: FC<ActionButtonProps> = ({ className = '' }) => (
  // Same structure as airswap web
  <div className={` ${className}`}>
    Action buttons
  </div>
);

export default ActionButton;
