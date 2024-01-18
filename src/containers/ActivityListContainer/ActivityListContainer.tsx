import { FC, useRef } from 'react';

import Icon from '../../components/Icon/Icon';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { NftTransactionLog } from '../../entities/NftTransactionLog/NftTransactionLog';
import NftDetailActivityItem from './subcomponents/NftDetailActivityItem/NftDetailActivityItem';

import './ActivityListContainer.scss';

interface NftDetailActivityProps {
  isEndOfList: boolean;
  isLoading: boolean;
  chainId: number;
  logs: NftTransactionLog[];
  onScrolledToBottom: () => void;
  className?: string;
}

const ActivityListContainer: FC<NftDetailActivityProps> = ({
  isEndOfList,
  isLoading,
  chainId,
  logs,
  onScrolledToBottom,
  className = '',
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const handleElementScroll = () => {
    if (elementRef.current && !isEndOfList) {
      const { scrollTop, clientHeight, scrollHeight } = elementRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        onScrolledToBottom();
      }
    }
  };

  if (isLoading && !logs.length) {
    return (
      <div className={`activity-list-container ${className}`}>
        <LoadingSpinner className="activity-list-container__loading-spinner" />
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className={`activity-list-container ${className}`}>
        No activity found
      </div>
    );
  }

  return (
    <div
      ref={elementRef}
      onScroll={handleElementScroll}
      className={`activity-list-container ${className}`}
    >
      <ul
        className="activity-list-container__items-list"
      >
        {logs.map(log => (
          <NftDetailActivityItem
            key={log.key}
            chainId={chainId}
            log={log}
          />
        ))}
        <li className="activity-list-container__last-list-item">
          {isLoading ? (
            <LoadingSpinner className="activity-list-container__loading-spinner" />
          ) : (
            <div className="activity-list-container__end-of-list">
              {isEndOfList && <Icon name="airswap" className="activity-list-container__airswap-icon" />}
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default ActivityListContainer;
