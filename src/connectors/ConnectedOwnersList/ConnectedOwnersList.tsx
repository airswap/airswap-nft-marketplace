import {
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Dialog from '../../compositions/Dialog/Dialog';
import OwnersContainer from '../../containers/OwnersContainer/OwnersContainer';
import { transformToAddress } from '../../entities/Address/AddressTransformers';
import useEnsAddresses from '../../hooks/useEnsAddresses';

interface ConnectedOwnersListProps {
  tokenId: string;
  onClose: () => void;
}

const ConnectedOwnersList: FC<ConnectedOwnersListProps> = ({ onClose, owners }): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [viewedAddresses, setViewedAddresses] = useState<string[]>([]);
  const addresses = useEnsAddresses(viewedAddresses);
  console.log(addresses);

  const allAddresses = useMemo(() => owners.map(owner => {
    const ensAddress = addresses.find(address => address.address === owner);

    return transformToAddress(owner, ensAddress?.ens, ensAddress?.isLoading);
  }), [owners, addresses]);


  const handleViewedAddressesChange = (values: string[]) => {
    setViewedAddresses(values);
  };

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [dialogRef, addresses]);

  return (
    <Dialog
      ref={dialogRef}
      onClose={onClose}
    >
      <OwnersContainer
        owners={allAddresses}
        onViewedAddressesChange={handleViewedAddressesChange}
      />
    </Dialog>
  );
};

export default ConnectedOwnersList;
