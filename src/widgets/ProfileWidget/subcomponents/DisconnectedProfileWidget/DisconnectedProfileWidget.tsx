import React, { FC } from 'react';

interface DisconnectedProfileWidgetProps {
  className?: string;
}

const DisconnectedProfileWidget: FC<DisconnectedProfileWidgetProps> = ({ className = '' }) => {
  // TODO: Implement this component or redirect to the connect wallet page.
  console.log('DisconnectedProfileWidget');
  return <div className={`profile-widget ${className}`}>DisconnectedProfileWidget</div>;
};

export default DisconnectedProfileWidget;
