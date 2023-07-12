import React, { FC } from 'react';

import { useParams } from 'react-router-dom';

import Page from '../../compositions/Page/Page';
import NftDetailWidget from '../../widgets/NftDetailWidget/NftDetailWidget';

const NftDetailPage: FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();

  return (
    <Page>
      <NftDetailWidget
        tokenId={tokenId ? +tokenId : 1}
      />
    </Page>
  );
};

export default NftDetailPage;
