import React, { FC, useRef, useState } from 'react';

import { ADDRESS_ZERO } from '@airswap/constants';
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { Contract } from 'ethers';

import NFTCard from '../../components/NFTCard/NFTCard';
import Page from '../../compositions/Page/Page';
import useContract from '../../hooks/useContract';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { useAppSelector } from '../../redux/hooks';
import CollectionWidget from '../../widgets/CollectionWidget/CollectionWidget';

import './CollectionPage.scss';

const CollectionPage: FC = () => {
  const { isActive } = useAppSelector((state) => state.web3);
  const { collectionToken } = useAppSelector((state) => state.config);

  const [tokensData, setTokensData] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);

  const index = React.useRef(0);
  const tokenIds = React.useRef<any[]>([]);

  const collectionContract = useRef<Contract | null>(null);
  collectionContract.current = useContract({ abi: ERC721.abi, address: collectionToken });
  const shouldNotDisplay = !isActive || !collectionContract.current || error;

  const fetchCollectionData = async () => {
    const CHUNK_SIZE = 20;
    const tokensToFetch = tokenIds.current.slice(index.current, index.current + CHUNK_SIZE);

    try {
      const dataPromises = tokensToFetch.map(async (tokenId) => {
        const tokenURI = await collectionContract.current?.tokenURI(tokenId);
        const res = await fetch(tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'));
        const data = await res.json();

        return data;
      });

      const newTokensData = await Promise.all(dataPromises);
      setTokensData((oldTokensData) => [...oldTokensData, ...newTokensData]);
    } catch (err) {
      setError(true);
    }

    index.current += CHUNK_SIZE;
  };

  const { isLoading } = useInfiniteScroll({ fetchCallback: fetchCollectionData });

  React.useEffect(() => {
    if (!collectionContract.current) return;

    /* Get token ids by filtering past events */
    const transferFilter = collectionContract.current.filters.Transfer(ADDRESS_ZERO);
    collectionContract.current.queryFilter(transferFilter, 0).then((events) => {
      tokenIds.current = events.map((e) => e.args?.at(2));
      fetchCollectionData();
    });
  }, [isActive]);

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
