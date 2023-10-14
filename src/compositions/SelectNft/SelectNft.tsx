import { FC, ReactElement, useMemo } from 'react';

import { CollectionTokenInfo } from '@airswap/types';

import SearchInput from '../../components/SearchInput/SearchInput';
import { getSelectNftOptions } from '../SelectNftButton/helpers/getSelectNftOptions';
import SelectNftListButton from './subcomponents/SelectNftListButton';

import './SelectNft.scss';

interface SelectNftProps {
  collectionName: string;
  collectionTokensInfo: CollectionTokenInfo[];
  tokens: string[];
  onClickNft: (id: string) => void;
  className?: string;
}

const SelectNft: FC<SelectNftProps> = ({
  collectionName,
  collectionTokensInfo,
  tokens,
  onClickNft,
  className = '',
}): ReactElement => {
  const options = useMemo(() => getSelectNftOptions(tokens, collectionName), [tokens, collectionName]);

  return (
    <div className={`select-nft ${className}`}>
      <SearchInput placeholder="Search nft" className="select-nft__search-input" />
      <ul className="select-nft__list">
        {options.map(option => {
          const nft = collectionTokensInfo.find(token => token.id.toString() === option.value);

          return (
            <li key={option.value}>
              <SelectNftListButton
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
