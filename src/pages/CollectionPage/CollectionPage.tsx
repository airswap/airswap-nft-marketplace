import React, { FC } from 'react';

import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';

import NFTCard from '../../components/NFTCard/NFTCard';
import Page from '../../compositions/Page/Page';
import useContract from '../../hooks/useContract';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { useAppSelector } from '../../redux/hooks';
import CollectionWidget from '../../widgets/CollectionWidget/CollectionWidget';

import './CollectionPage.scss';

const CollectionPage: FC = () => {
  const { collectionToken } = useAppSelector((state) => state.config);
  const collectionContract = useContract({ abi: ERC721.abi, address: collectionToken });

  const [tokensData, setTokensData] = React.useState<any[]>([]);

  const index = React.useRef(0);
  const tokenIds = React.useRef<any[]>([]);

  const fetchCollectionData = async () => {
    const CHUNK_SIZE = 20;

    const tokensToFetch = tokenIds.current.slice(index.current, index.current + CHUNK_SIZE);

    const dataPromises = tokensToFetch.map(async (tokenId) => {
      const tokenURI = await collectionContract.tokenURI(tokenId);
      const res = await fetch(tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'));
      const data = await res.json();

      return data;
    });

    const newTokensData = await Promise.all(dataPromises);
    setTokensData((oldTokensData) => [...oldTokensData, ...newTokensData]);

    index.current += CHUNK_SIZE;
  };

  useInfiniteScroll({ fetchCallback: fetchCollectionData });

  React.useEffect(() => {
    /* Get token ids by filtering past events */
    const transferFilter = collectionContract.filters.Transfer('0x0000000000000000000000000000000000000000');
    collectionContract.queryFilter(transferFilter, 0).then((events) => {
      tokenIds.current = events.map((e) => e.args?.at(2));
      fetchCollectionData();
    });
  }, []);

  return (
    <Page
      className="collection-page"
      contentClassName="collection-page__content"
    >
      <CollectionWidget />
      <div className="nft-list">
        {tokensData.map((t) => (
          <NFTCard
            name={t.name}
            imageURI={t.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
            price={Math.floor(Math.random() * (1000 - 100) + 100) / 100}
          />
        ))}
      </div>
    </Page>
  );
};

export default CollectionPage;
