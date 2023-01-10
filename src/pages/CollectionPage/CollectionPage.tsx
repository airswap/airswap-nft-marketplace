import React, { FC } from 'react';

import Page from '../../compositions/Page/Page';
import CollectionWidget from '../../widgets/CollectionWidget/CollectionWidget';

import './CollectionPage.scss';

const CollectionPage: FC = () => (
  <Page
    className="collection-page"
    contentClassName="collection-page__content"
  >
    <CollectionWidget />
  </Page>
);

export default CollectionPage;
