import React, { FC } from 'react';

import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { ethers } from 'ethers';

import { useAppSelector } from '../../redux/hooks';
import CollectionPortrait from './subcomponents/CollectionPortrait/CollectionPortrait';

import './CollectionWidget.scss';

const CollectionWidget: FC = () => {
  const { collectionImage, collectionName, collectionToken } = useAppSelector((state) => state.config);

  const index = React.useRef(0);
  const tokenIds = React.useRef<any[]>([]);

  const [tokensData, setTokensData] = React.useState<any[]>([]);

  const erc721Interface = new ethers.utils.Interface(ERC721.abi);
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const collectionContract = new ethers.Contract(
    collectionToken,
    erc721Interface,
    provider,
  );

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

  const handleScroll = async () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;

    /* Fetch more items */
    await fetchCollectionData();
  };

  const getTokenIds = async () => {
    const transferFilter = collectionContract.filters.Transfer('0x0000000000000000000000000000000000000000');
    const events = await collectionContract.queryFilter(transferFilter, 0);

    tokenIds.current = events.map((e) => e.args?.at(2));
    fetchCollectionData();
  };

  React.useEffect(() => {
    getTokenIds();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
