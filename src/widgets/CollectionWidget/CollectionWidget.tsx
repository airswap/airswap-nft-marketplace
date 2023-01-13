/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect } from 'react';

import useNftMetadata from '../../hooks/useNftMetadata';
import { useAppSelector } from '../../redux/hooks';
import CollectionPortrait from './subcomponents/CollectionPortrait/CollectionPortrait';

import './CollectionWidget.scss';

const CollectionWidget: FC = () => {
  const { collectionImage, collectionName, collectionToken } = useAppSelector(
    (state) => state.config,
  );

  const nftMetadata = useNftMetadata(collectionToken, '3060');

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
