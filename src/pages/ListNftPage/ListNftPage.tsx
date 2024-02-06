import React, { FC } from 'react';

import Helmet from '../../compositions/Helmet/Helmet';
import ConnectedPage from '../../connectors/ConnectedPage/ConnectedPage';
import ListNftWidget from '../../widgets/ListNftWidget/ListNftWidget';

import './ListNftPage.scss';

const ListNftPage: FC = () => (
  <ConnectedPage className="list-nft-page">
    <Helmet title="List a token" />
    <div className="list-nft-page__list-nft-widget-cover">
      <div className="list-nft-page__list-nft-widget-container">
        <ListNftWidget className="list-nft-page__list-nft-widget" />
      </div>
    </div>
  </ConnectedPage>
);

export default ListNftPage;
