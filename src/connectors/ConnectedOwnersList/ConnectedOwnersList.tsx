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
  onClose: () => void;
}

const ConnectedOwnersList: FC<ConnectedOwnersListProps> = ({ library, tokenId, onClose }): ReactElement => {
  const dispatch = useAppDispatch();

  const { isLoadingOwners, owners, ownersPageKey } = useAppSelector((state) => state.owners);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pageKey, setPageKey] = useState(1);
  const isEndOfList = ownersPageKey === null;

  const handleScrolledToBottom = () => {
    if (!isLoadingOwners && !isEndOfList) {
      setPageKey(pageKey + 1);
    }
  };

  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    dispatch(getErc1155OwnerAddresses({ tokenId, provider: library }));
  }, [pageKey, tokenId]);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [dialogRef]);

  return (
    <Dialog
      ref={dialogRef}
      onClose={onClose}
    >
      <OwnersContainer
        isEndOfList={isEndOfList}
        isLoading={isLoadingOwners}
        owners={owners}
        onScrolledToBottom={handleScrolledToBottom}
      />
    </Dialog>
  );
};

export default ConnectedOwnersList;
