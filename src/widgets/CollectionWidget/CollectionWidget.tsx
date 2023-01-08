import React, { FC } from 'react';

import { useAppSelector } from '../../redux/hooks';
import CollectionPortrait from './subcomponents/CollectionPortrait/CollectionPortrait';

import './CollectionWidget.scss';

const CollectionWidget: FC = () => {
  const { collectionImage, collectionName } = useAppSelector((state) => state.config);

  return (
    <div className="collection-widget">
      <CollectionPortrait
        backgroundImage={collectionImage}
        subTitle="By Sjnivo"
        title={collectionName}
        className="collection-widget__portrait"
      />
    </div>
  );
};

export default CollectionWidget;
