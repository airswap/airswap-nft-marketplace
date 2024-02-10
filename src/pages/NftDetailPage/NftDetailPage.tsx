import React, { FC } from 'react';

import { useParams } from 'react-router-dom';

import Helmet from '../../compositions/Helmet/Helmet';
import ConnectedPage from '../../connectors/ConnectedPage/ConnectedPage';
import NftDetailWidget from '../../widgets/NftDetailWidget/NftDetailWidget';

const NftDetailPage: FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();

  return (
    <ConnectedPage>
      <Helmet title={`Token ${tokenId || 1}`} />
      <NftDetailWidget
        tokenId={tokenId || '1'}
      />
    </ConnectedPage>
  );
};

export default NftDetailPage;
