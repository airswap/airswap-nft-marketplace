import {
  FC,
  ReactElement,
  useEffect,
  useState,
} from 'react';

import { BigNumber } from 'bignumber.js';

import SelectNft from '../../compositions/SelectNft/SelectNft';
import { getUniqueSingleDimensionArray } from '../../helpers/array';
import useCollectionName from '../../hooks/useCollectionName';
import useCollectionTokens from '../../hooks/useCollectionTokens';
import { useAppSelector } from '../../redux/hooks';

interface ConnectedNftSelectorProps {
  selectedToken: string;
  tokens: string[];
  onClickNft: (token: string) => void;
  className?: string;
}

const ConnectedNftSelector: FC<ConnectedNftSelectorProps> = ({
  selectedToken,
  tokens: allTokens,
  onClickNft,
  className = '',
}): ReactElement => {
  const { collectionToken } = useAppSelector(state => state.config);
  const { tokenIdsWithBalance } = useAppSelector(state => state.balances);
  const { userOrders } = useAppSelector(state => state.listNft);

  const collectionName = useCollectionName();

  const [tokens, setTokens] = useState<string[]>([selectedToken]);
  const [viewedTokens, setViewedTokens] = useState<string[]>([]);

  const [tokenInfo, tokenInfoIsLoading] = useCollectionTokens(collectionToken, tokens);

  const handleScroll = (newTokens: string[]) => {
    setViewedTokens(newTokens);
  };

  useEffect(() => {
    if (viewedTokens.length && !tokenInfoIsLoading) {
      const newTokens = [...tokens, ...viewedTokens]
        .filter(getUniqueSingleDimensionArray)
        .sort((a, b) => new BigNumber(a).minus(b).toNumber());

      setTokens(newTokens);
    }
  }, [viewedTokens, tokenInfoIsLoading]);

  return (
    <SelectNft
      collectionName={collectionName}
      loadingTokens={viewedTokens}
      orders={userOrders}
      tokenIdsWithBalance={tokenIdsWithBalance}
      tokenInfo={tokenInfo}
      tokens={allTokens}
      onClickNft={onClickNft}
      onScroll={handleScroll}
      className={className}
    />
  );
};

export default ConnectedNftSelector;
