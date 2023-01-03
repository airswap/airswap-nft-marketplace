import React, { FC } from 'react';

import Button from '../../components/Button/Button';

import './CollectionWidget.scss';

const CollectionWidget: FC = () => (
  <div className="collection-widget">
    <h1>Collection Widget</h1>
    <Button text="Proceed" className="collection-widget__proceed-button" />
  </div>
);

export default CollectionWidget;
