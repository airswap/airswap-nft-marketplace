import { FC } from 'react';

import './Avatar.scss';

interface AvatarProps {
  avatarUrl?: string;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({ avatarUrl, className = '' }) => (
  <div className={`avatar ${className}`} style={{ backgroundImage: `url("${avatarUrl}")` }} />
);

export default Avatar;
