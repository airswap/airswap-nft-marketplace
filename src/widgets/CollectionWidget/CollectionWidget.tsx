import React, { FC } from 'react';

import SearchInput from '../../components/SearchInput/SearchInput';
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
      <div className="collection-widget__content">
        <SearchInput placeholder="Search Collection" className="collection-widget__search-input" />
      </div>
    </div>
  );
};

export default CollectionWidget;
