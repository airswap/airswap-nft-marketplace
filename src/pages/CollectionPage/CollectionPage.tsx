import React, { FC } from 'react';

import Helmet from '../../compositions/Helmet/Helmet';
import Page from '../../compositions/Page/Page';
import CollectionWidget from '../../widgets/CollectionWidget/CollectionWidget';

import './CollectionPage.scss';

const CollectionPage: FC = () => (
  <Page
    className="collection-page"
    contentClassName="collection-page__content"
  >
    <Helmet title="All listings" />
    <CollectionWidget />
  </Page>
);

export default CollectionPage;
