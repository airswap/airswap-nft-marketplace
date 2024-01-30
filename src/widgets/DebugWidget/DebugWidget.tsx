import { FC, ReactElement } from 'react';

import { chainNames } from '@airswap/utils';

import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useAppSelector } from '../../redux/hooks';

import './DebugWidget.scss';

interface DebugWidgetProps {
  className?: string;
}

const DebugWidget: FC<DebugWidgetProps> = ({ className = '' }): ReactElement => {
  const {
    hasFailedCollectionToken,
    hasFailedCurrencyToken,
    isLoadingCollectionTokenKind,
    isLoadingCurrencyTokenKind,
    chainId,
    collectionToken,
    currencyToken,
    swapContractAddress,
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
        {(collectionToken && hasFailedCollectionToken) && <li>{`REACT_APP_COLLECTION_TOKEN ${collectionToken} on ${chainNames[chainId]} is not a valid ERC721 or ERC1155 token`}</li>}
        {!currencyToken && <li>REACT_APP_CURRENCY_TOKEN not set</li>}
        {(currencyToken && hasFailedCurrencyToken) && <li>{`REACT_APP_CURRENCY_TOKEN ${currencyToken} on ${chainNames[chainId]} is not a valid ERC20 token`}</li>}
        {swapContractAddress === null && <li>{`No swap contract deployed on chain id ${chainId} (${chainNames[chainId]})`}</li>}
      </ul>
    </div>
  );
};

export default DebugWidget;
