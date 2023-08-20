import { FC, ReactElement } from 'react';

import { chainNames } from '@airswap/constants';

import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useAppSelector } from '../../redux/hooks';

import './DebugWidget.scss';

interface DebugWidgetProps {
  className?: string;
}

const DebugWidget: FC<DebugWidgetProps> = ({ className = '' }): ReactElement => {
  const {
    isLoadingCollectionTokenKind,
    isLoadingCurrencyTokenKind,
    chainId,
    collectionToken,
    collectionTokenKind,
    currencyToken,
    currencyTokenKind,
  } = useAppSelector(state => state.config);

  const isLoading = isLoadingCollectionTokenKind || isLoadingCurrencyTokenKind;

  if (isLoading) {
    return (
      <div className={`debug-widget ${className}`}>
        <h1 className="debug-widget__title">Debug</h1>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`debug-widget ${className}`}>
      <h1 className="debug-widget__title">Debug</h1>
      <p className="debug-widget__intro">Your .env was not setup properly:</p>
      <ul>
        {!collectionToken && <li>REACT_APP_COLLECTION_TOKEN not set</li>}
        {(collectionToken && !collectionTokenKind) && <li>{`REACT_APP_COLLECTION_TOKEN ${collectionToken} on ${chainNames[chainId]} is not a valid ERC721 or ERC1155 token`}</li>}
        {!currencyToken && <li>REACT_APP_CURRENCY_TOKEN not set</li>}
        {(currencyToken && !currencyTokenKind) && <li>{`REACT_APP_CURRENCY_TOKEN ${currencyToken} on ${chainNames[chainId]} is not a valid ERC20 token`}</li>}
      </ul>
    </div>
  );
};

export default DebugWidget;
