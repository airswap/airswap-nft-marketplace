import React, { FC } from 'react';

import { useAppSelector } from '../../../../redux/hooks';
import CollectionPortrait from '../CollectionPortrait/CollectionPortrait';

interface DisconnectedCollectionWidgetProps {
  className?: string;
}

const DisconnectedCollectionWidget: FC<DisconnectedCollectionWidgetProps> = ({ className = '' }) => {
  const { collectionImage, collectionName } = useAppSelector((state) => state.config);

  return (
    <div className={`collection-widget ${className}`}>
      <CollectionPortrait
        backgroundImage={collectionImage}
        subTitle="Collection"
        title={collectionName}
        className="collection-widget__portrait"
      />
    </div>
  );
};

export default DisconnectedCollectionWidget;
