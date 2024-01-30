import {
  ChangeEvent,
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { CollectionTokenInfo } from '@airswap/utils';
import { useDebounce } from 'react-use';

import SearchInput from '../../components/SearchInput/SearchInput';
import { ExtendedFullOrder } from '../../entities/FullOrder/FullOrder';
import { TokenIdsWithBalance } from '../../entities/TokenIdsWithBalance/TokenIdsWithBalance';
import { FullOrderState } from '../../types/FullOrderState';
import EmptyState from '../EmptyState/EmptyState';
import { getSelectNftOptions } from '../SelectNftButton/helpers/getSelectNftOptions';
import { filterTokenBySearchValue } from './helpers/filterTokenBySearchValue';
import SelectNftListButton from './subcomponents/SelectNftListButton';

import './SelectNft.scss';

interface SelectNftProps {
  collectionName: string;
  tokenIdsWithBalance: TokenIdsWithBalance;
  tokenInfo: CollectionTokenInfo[];
  tokens: string[];
  loadingTokens?: string[];
  orders: ExtendedFullOrder[];
  onClickNft: (id: string) => void;
  onScroll: (tokens: string[]) => void;
  className?: string;
}

const SelectNft: FC<SelectNftProps> = ({
  collectionName,
  tokenIdsWithBalance,
  tokenInfo,
  tokens,
  loadingTokens = [],
  orders,
  onClickNft,
  onScroll,
  className = '',
}): ReactElement => {
  const ref = useRef<HTMLUListElement>(null);

  const [viewedTokens, setViewedTokens] = useState<string[]>([]);
  const [debouncedViewedTokens, setDebouncedViewedTokens] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const filteredTokens = useMemo(() => tokens.filter(token => filterTokenBySearchValue(token, searchValue, tokenInfo)), [tokens, searchValue, orders]);
  const options = useMemo(() => getSelectNftOptions(filteredTokens, collectionName), [filteredTokens, collectionName]);

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

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    getViewedTokens(ref.current);
  }, [options]);

  return (
    <div className={`select-nft ${className}`}>
      <SearchInput
        placeholder="Search nft"
        onChange={handleSearchInputChange}
        className="select-nft__search-input"
      />

      {options.length === 0 && (
        <EmptyState
          text="No tokens found. Try another search term."
          className="select-nft__empty-state"
        />
      )}

      <ul
        ref={ref}
        onScroll={handleScroll}
        className="select-nft__list"
      >
        {options.map(option => {
          const nft = tokenInfo.find(token => token.id === option.value);
          const isLoading = !nft && loadingTokens.some(token => token === option.value);
          const isListed = orders.some(order => order.state === FullOrderState.open && order.signer.id === option.value);
          const balance = tokenIdsWithBalance[option.value];

          return (
            <li key={option.value}>
              <SelectNftListButton
                isListed={isListed}
                isLoading={isLoading}
                isPreview={!nft}
                balance={balance === '1' ? undefined : balance}
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
