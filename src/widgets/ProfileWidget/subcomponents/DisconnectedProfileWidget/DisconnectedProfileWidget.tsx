import React, { FC } from 'react';

interface DisconnectedProfileWidgetProps {
  className?: string;
}

const DisconnectedProfileWidget: FC<DisconnectedProfileWidgetProps> = ({ className = '' }) => {
  console.log('DisconnectedProfileWidget');
  return <div className={`profile-widget ${className}`}>DisconnectedProfileWidget</div>;
};

export default DisconnectedProfileWidget;
