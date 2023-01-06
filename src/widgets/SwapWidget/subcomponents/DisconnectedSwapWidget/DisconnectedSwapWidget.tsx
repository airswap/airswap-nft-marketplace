import React, { FC } from 'react';

interface DisconnectedSwapWidgetProps {
  className?: string;
}

const DisconnectedSwapWidget: FC<DisconnectedSwapWidgetProps> = ({ className = '' }) => (
  <div className={` ${className}`}>
    disconnected swap widget
  </div>
);

export default DisconnectedSwapWidget;
