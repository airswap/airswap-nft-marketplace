import React, { FC } from 'react';

import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';

import useContract from '../../hooks/useContract';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { useAppSelector } from '../../redux/hooks';
import CollectionPortrait from './subcomponents/CollectionPortrait/CollectionPortrait';

import './CollectionWidget.scss';

const CollectionWidget: FC = () => {
  const [tokensData, setTokensData] = React.useState<any[]>([]);

  const index = React.useRef(0);
  const tokenIds = React.useRef<any[]>([]);

  const { collectionImage, collectionName, collectionToken } = useAppSelector((state) => state.config);
  const collectionContract = useContract({ abi: ERC721.abi, address: collectionToken });

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
    <div className="collection-widget">
      <CollectionPortrait
        backgroundImage={collectionImage}
        subTitle="By Sjnivo"
        title={collectionName}
        className="collection-widget__portrait"
      />

      {tokensData.map((t) => (
        <div key={t.name}>
          <div>{t.name}</div>
          <div>{t.description}</div>
        </div>
      ))}
    </div>
  );
};

export default CollectionWidget;
