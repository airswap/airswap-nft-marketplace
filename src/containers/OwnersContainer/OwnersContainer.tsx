import {
  FC,
  ReactElement,
  useEffect,
  useRef,
} from 'react';

import Icon from '../../components/Icon/Icon';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { Address } from '../../entities/Address/Address';
import OwnersListItem from './subcomponents/OwnersListItem/OwnersListItem';

import './OwnersContainer.scss';

interface OwnersContainerProps {
  isEndOfList: boolean;
  isLoading: boolean;
  owners: Address[];
  onScrolledToBottom: () => void;
  className?: string;
}

const OwnersContainer: FC<OwnersContainerProps> = ({
  isEndOfList,
  isLoading,
  owners,
  onScrolledToBottom,
  className = '',
}): ReactElement => {
  const listRef = useRef<HTMLUListElement>(null);

  const handleListScroll = () => {
    if (listRef.current && !isEndOfList) {
      const { scrollTop, clientHeight, scrollHeight } = listRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        onScrolledToBottom();
      }
    }
  };

  useEffect(() => {
    if (isLoading && listRef.current) {
      listRef.current.scrollTo(0, listRef.current.scrollHeight);
    }
  }, [isLoading]);

  if (isLoading && !owners.length) {
    return (
      <div className={`owners-container ${className}`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`owners-container ${className}`}>
      <ul
        ref={listRef}
        onScroll={handleListScroll}
        className="owners-container__list"
      >
        {owners.map(owner => <OwnersListItem key={owner.address} owner={owner} />)}
        <li>
          {isLoading ? (
            <LoadingSpinner className="owners-container__loading-spinner" />
          ) : (
            <div className="owners-container__end-of-list">
              {isEndOfList && <Icon name="airswap" className="owners-container__airswap-icon" />}
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default OwnersContainer;
