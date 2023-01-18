import React, { FC, useState } from 'react';

import NFTCard from '../../components/NFTCard/NFTCard';
import Page from '../../compositions/Page/Page';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchNFTMetadata } from '../../redux/stores/collection/collectionApi';
import CollectionWidget from '../../widgets/CollectionWidget/CollectionWidget';

import './CollectionPage.scss';

const CollectionPage: FC = () => {
  const { isActive } = useAppSelector((state) => state.web3);
  const { tokensData } = useAppSelector((state) => state.collection);
  const dispatch = useAppDispatch();

  const fetchCallback = async (): Promise<void> => {
    await dispatch(fetchNFTMetadata());
  };

  const [error] = useState<boolean>(false);

  const shouldNotDisplay = !isActive || error;


  const { isLoading } = useInfiniteScroll({ fetchCallback });

  return (
    <Page
      className="collection-page"
      contentClassName="collection-page__content"
    >
      {shouldNotDisplay
        ? <div className="status">Collection could not be displayed...</div>
        : (
          <>
            <CollectionWidget />
            <div className="nft-list">
              {tokensData.map((t) => (
                <NFTCard
                  key={t.name}
                  name={t.name}
                  imageURI={t.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                  price={Math.floor(Math.random() * (1000 - 100) + 100) / 100}
                />
              ))}
            </div>
            {isLoading && <div className="loading">Fetching more NFTs ...</div>}
          </>
      )}
    </Page>
  );
};

export default CollectionPage;
