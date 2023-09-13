import React, { FC } from 'react';

import { useParams } from 'react-router-dom';

import Helmet from '../../compositions/Helmet/Helmet';
import Page from '../../compositions/Page/Page';
import NftDetailWidget from '../../widgets/NftDetailWidget/NftDetailWidget';

const NftDetailPage: FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();

  return (
    <Page>
      <Helmet title={`Token ${tokenId || 1}`} />
      <NftDetailWidget
        tokenId={tokenId || '1'}
      />
    </Page>
  );
};

export default NftDetailPage;
