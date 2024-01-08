import {
  FC,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useDebounce } from 'react-use';

import { Address } from '../../entities/Address/Address';
import { getElementVisibleChildrenIndices } from '../../helpers/tools';
import OwnersListItem from './subcomponents/OwnersListItem/OwnersListItem';

import './OwnersContainer.scss';

interface OwnersContainerProps {
  owners: Address[];
  onViewedAddressesChange: (viewedAddresses: string[]) => void;
  className?: string;
}

const OwnersContainer: FC<OwnersContainerProps> = ({ owners, onViewedAddressesChange, className = '' }): ReactElement => {
  const listRef = useRef<HTMLUListElement>(null);

  const [viewedAddresses, setViewedAddresses] = useState<string[]>([]);
  const [debouncedViewedAddresses, setDebouncedViewedAddresses] = useState<string[]>([]);

  const getViewedAddresses = () => {
    if (!listRef.current) {
      return;
    }

    const { start, end } = getElementVisibleChildrenIndices(listRef.current);
    const ownerAddresses = owners.map(owner => owner.address);

    setViewedAddresses(ownerAddresses.slice(start, end));
  };

  const handleListScroll = () => {
    getViewedAddresses();
  };

  useEffect(() => {
    getViewedAddresses();
  }, []);

  useDebounce((): void => {
    setDebouncedViewedAddresses(viewedAddresses);
  }, 300, [viewedAddresses]);

  useEffect(() => {
    onViewedAddressesChange(debouncedViewedAddresses);
  }, [debouncedViewedAddresses]);

  return (
    <div className={`owners-container ${className}`}>
      <ul
        ref={listRef}
        onScroll={handleListScroll}
        className="owners-container__list"
      >
        {owners.map(owner => <OwnersListItem key={owner.address} owner={owner} />)}
      </ul>
    </div>
  );
};

export default OwnersContainer;
