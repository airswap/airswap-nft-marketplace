import {
  FC,
  ReactElement,
  useEffect,
  useState,
} from 'react';

import ActivityListContainer from '../../containers/ActivityListContainer/ActivityListContainer';
import useDefaultLibrary from '../../hooks/useDefaultProvider';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getNftTransactionReceipts } from '../../redux/stores/nftActivity/nftActivityApi';
import { reset } from '../../redux/stores/nftActivity/nftActivitySlice';

interface ConnectedActivityListProps {
  isEnabled: boolean;
  tokenId: string;
}

const ConnectedActivityList: FC<ConnectedActivityListProps> = ({ isEnabled, tokenId }): ReactElement => {
  const dispatch = useAppDispatch();
  const library = useDefaultLibrary();
  const { chainId } = useAppSelector(state => state.config);
  const { isLoading, logs, pageKey } = useAppSelector(state => state.nftActivity);

  const [page, setPage] = useState(1);
  const isEndOfList = pageKey === null;

  const handleScrolledToBottom = () => {
    if (!isLoading && !isEndOfList) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    if (library && isEnabled) {
      dispatch(getNftTransactionReceipts({ provider: library, tokenId }));
    }
  }, [
    library,
    tokenId,
    page,
    isEnabled,
  ]);

  useEffect(() => {
    dispatch(reset());
  }, []);

  return (
    <ActivityListContainer
      isEndOfList={isEndOfList}
      isLoading={isLoading}
      chainId={chainId}
      logs={logs}
      onScrolledToBottom={handleScrolledToBottom}
    />
  );
};

export default ConnectedActivityList;
