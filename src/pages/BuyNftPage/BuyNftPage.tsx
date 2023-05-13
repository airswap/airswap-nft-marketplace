import React, { FC } from 'react';

import Page from '../../compositions/Page/Page';
import BuyNftWidget from '../../widgets/BuyNftWidget/BuyNftWidget';
import NftDetailWidget from '../../widgets/NftDetailWidget/NftDetailWidget';

import './BuyNftPage.scss';

const BuyNftPage: FC = () => (
  <Page className="buy-nft-page">
    <NftDetailWidget className="buy-nft-page__nft-detail-widget" />
    <div className="buy-nft-page__buy-nft-widget-container">
      <BuyNftWidget className="buy-nft-page__buy-nft-widget" />
    </div>
  </Page>
);

export default BuyNftPage;
