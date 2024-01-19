import { FC, ReactElement, useRef } from 'react';

import classNames from 'classnames';

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
}): ReactElement => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const wrapperClassName = classNames('activity-list-container', {
    'activity-list-container--has-scrollbar': logs.length > 4,
    'activity-list-container--is-end-of-list': isEndOfList,
  }, className);

  const handleElementScroll = () => {
    if (scrollRef.current && !isEndOfList) {
      const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        onScrolledToBottom();
      }
    }
  };

  if (isLoading && !logs.length) {
    return (
      <div className={wrapperClassName}>
        <LoadingSpinner className="activity-list-container__loading-spinner" />
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className={wrapperClassName}>
        No activity found
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <div
        ref={scrollRef}
        onScroll={handleElementScroll}
        className="activity-list-container__scroller"
      >
        <ul className="activity-list-container__items-list">
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
    </div>
  );
};

export default ActivityListContainer;
