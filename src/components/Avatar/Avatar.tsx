import { FC, useEffect, useState } from 'react';

import './Avatar.scss';

interface AvatarProps {
  address?: string;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({ address = '', className = '' }) => {
  const [img, setImg] = useState<string>('');
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
    const fetchImage = async () => {
      const src: string = await getIcon();
      return src;
    };
    fetchImage().then(src => setImg(src));
  }, [address]);

  return (
    <img className={className} src={img} width="30" height="30" alt="icon" />
  );
};

export default Avatar;
