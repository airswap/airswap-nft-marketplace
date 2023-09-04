import React, { FC } from 'react';

import './CollectionPortrait.scss';

interface CollectionPortraitProps {
  backgroundImage: string;
  subTitle: string;
  title: string;
  className?: string;
}

const CollectionPortrait: FC<CollectionPortraitProps> = ({
  backgroundImage,
  title,
  subTitle,
  className = '',
}) => (
  <div
    style={{ backgroundImage: `url("${backgroundImage}")` }}
    className={`collection-portrait ${className}`}
  >
    <h2 className="collection-portrait__sub-title">{subTitle}</h2>
    <h1 className="collection-portrait__title">{title}</h1>
  </div>
);

export default CollectionPortrait;
