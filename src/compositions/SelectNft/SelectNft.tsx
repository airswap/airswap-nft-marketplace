import {
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { CollectionTokenInfo } from '@airswap/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useDebounce } from 'react-use';

import SearchInput from '../../components/SearchInput/SearchInput';
import { getSelectNftOptions } from '../SelectNftButton/helpers/getSelectNftOptions';
import SelectNftListButton from './subcomponents/SelectNftListButton';

import './SelectNft.scss';

interface SelectNftProps {
  collectionName: string;
  tokenInfo: CollectionTokenInfo[];
  tokens: string[];
  loadingTokens?: string[];
  onClickNft: (id: string) => void;
  onScroll: (tokens: string[]) => void;
  className?: string;
}

const SelectNft: FC<SelectNftProps> = ({
  collectionName,
  tokenInfo,
  tokens,
  loadingTokens = [],
  onClickNft,
  onScroll,
  className = '',
}): ReactElement => {
  const options = useMemo(() => getSelectNftOptions(tokens, collectionName), [tokens, collectionName]);
  const ref = useRef<HTMLUListElement>(null);

  const [viewedTokens, setViewedTokens] = useState<string[]>([]);
  const [debouncedViewedTokens, setDebouncedViewedTokens] = useState<string[]>([]);

  useDebounce((): void => {
    setDebouncedViewedTokens(viewedTokens);
  }, 300, [viewedTokens]);

  useEffect(() => {
    onScroll(debouncedViewedTokens);
  }, [debouncedViewedTokens]);

  const getViewedTokens = (element: HTMLUListElement | null) => {
    const firstChild = ref.current?.firstChild as HTMLLIElement | null;

    if (!element || !firstChild) {
      return;
    }

    const { clientHeight, scrollTop } = element;
    const itemHeight = firstChild.clientHeight;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = startIndex + Math.ceil(clientHeight / itemHeight);

    setViewedTokens(options.slice(startIndex, endIndex).map(option => option.value));
  };

  const handleScroll = () => {
    getViewedTokens(ref.current);
  };

  useEffect(() => {
    getViewedTokens(ref.current);
  }, []);

  return (
    <div className={`select-nft ${className}`}>
      <SearchInput placeholder="Search nft" className="select-nft__search-input" />
      <ul
        ref={ref}
        onScroll={handleScroll}
        className="select-nft__list"
      >
        {options.map(option => {
          const nft = tokenInfo.find(token => token.id.toString() === option.value);
          const isLoading = !nft && loadingTokens.some(token => token === option.value);

          return (
            <li key={option.value}>
              <SelectNftListButton
                isLoading={isLoading}
                isPreview={!nft}
                name={nft?.name || option.label}
                logoURI={nft?.image || ''}
                value={option.value}
                onClick={onClickNft}
                className="select-nft__nft-button"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SelectNft;
