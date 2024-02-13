import {
  FC,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import { BaseProvider } from '@ethersproject/providers';

import Dialog from '../../compositions/Dialog/Dialog';
import OwnersContainer from '../../containers/OwnersContainer/OwnersContainer';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getErc1155OwnerAddresses } from '../../redux/stores/owners/ownersApi';
import { reset } from '../../redux/stores/owners/ownersSlice';

interface ConnectedOwnersListProps {
  library: BaseProvider;
  tokenId: string;
  tokenName?: string;
  onClose: () => void;
}

const ConnectedOwnersList: FC<ConnectedOwnersListProps> = ({
  library,
  tokenId,
  tokenName,
  onClose,
}): ReactElement => {
  const dispatch = useAppDispatch();

  const { isLoading, owners, pageKey } = useAppSelector((state) => state.owners);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [page, setPage] = useState(1);
  const isEndOfList = pageKey === null;

  const handleScrolledToBottom = () => {
    if (!isLoading && !isEndOfList) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    dispatch(getErc1155OwnerAddresses({ tokenId, provider: library }));
  }, [page, tokenId]);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [dialogRef]);

  return (
    <Dialog
      label={`Owners of ${tokenName || tokenId}`}
      ref={dialogRef}
      onClose={onClose}
    >
      <OwnersContainer
        isEndOfList={isEndOfList}
        isLoading={isLoading}
        owners={owners}
        onScrolledToBottom={handleScrolledToBottom}
      />
    </Dialog>
  );
};

export default ConnectedOwnersList;
