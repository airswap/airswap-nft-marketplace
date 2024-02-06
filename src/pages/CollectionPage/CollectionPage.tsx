import React, { FC } from 'react';

import Helmet from '../../compositions/Helmet/Helmet';
import ConnectedPage from '../../connectors/ConnectedPage/ConnectedPage';
import CollectionWidget from '../../widgets/CollectionWidget/CollectionWidget';

import './CollectionPage.scss';

const CollectionPage: FC = () => (
  <ConnectedPage
    className="collection-page"
    contentClassName="collection-page__content"
  >
    <Helmet title="All listings" />
    <CollectionWidget />
  </ConnectedPage>
);

export default CollectionPage;
