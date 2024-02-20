import React, { FC } from 'react';

import useCollectionImage from '../../../../hooks/useCollectionImage';
import useCollectionName from '../../../../hooks/useCollectionName';
import CollectionPortrait from '../CollectionPortrait/CollectionPortrait';

interface DisconnectedCollectionWidgetProps {
  className?: string;
}

const DisconnectedCollectionWidget: FC<DisconnectedCollectionWidgetProps> = ({ className = '' }) => {
  const { bannerImage } = useCollectionImage();
  const collectionName = useCollectionName();

  return (
    <div className={`collection-widget ${className}`}>
      <CollectionPortrait
        backgroundImage={bannerImage}
        subTitle="Collection"
        title={collectionName}
        className="collection-widget__portrait"
      />
    </div>
  );
};

export default DisconnectedCollectionWidget;
