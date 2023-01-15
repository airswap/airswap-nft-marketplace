import { FC, useEffect, useState } from 'react';

import './Avatar.scss';

interface AvatarProps {
  address?: string;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({ address = '', className = '' }) => {
  const [linkIcon, setlinkIcon] = useState<string>('');
  async function getIcon(): Promise<string> {
    const response = await fetch(
      `https://api.dicebear.com/5.x/identicon/svg?seed=${address}`,
    );
    const blob = await response.blob();
    return new Promise((resolve) => {
      if (blob) {
        resolve(URL.createObjectURL(blob));
      }
    });
  }

  useEffect(() => {
    const fetchLinkIcon = async () => {
      const src: string = await getIcon();
      return src;
    };
    fetchLinkIcon().then(link => setlinkIcon(link));
  }, [address]);

  return (
    <img className={`avatar ${className}`} src={linkIcon} alt="avatar" />
  );
};

export default Avatar;
