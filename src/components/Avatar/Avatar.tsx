import { FC } from 'react';

import './Avatar.scss';

interface AvatarProps {
  avatarUrl?: string;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({ avatarUrl, className = '' }) => (
  <img className={`avatar ${className}`} src={avatarUrl} alt="avatar" />
);

export default Avatar;
