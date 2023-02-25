import React, { FC } from 'react';

import Page from '../../compositions/Page/Page';
import ListNftWidget from '../../widgets/ListNftWidget/ListNftWidget';

import './ListNftPage.scss';

const ListNftPage: FC = () => (
  <Page className="list-nft-page">
    <div className="list-nft-page__list-nft-widget-cover">
      <div className="list-nft-page__list-nft-widget-container">
        <ListNftWidget className="list-nft-page__list-nft-widget" />
      </div>
    </div>
  </Page>
);

export default ListNftPage;
