import React, { FC } from 'react';

import { useWeb3React } from '@web3-react/core';

import { useAppSelector } from '../../redux/hooks';
import { selectCurrencyTokenInfo } from '../../redux/stores/metadata/metadataSlice';
import ConnectedListNftWidget from './subcomponents/ConnectedListNftWidget/ConnectedListNftWidget';

interface ListNftWidgetProps {
  className?: string;
}

const ListNftWidget: FC<ListNftWidgetProps> = ({ className = '' }) => {
  const { library, chainId } = useWeb3React();
  const currencyToken = useAppSelector(selectCurrencyTokenInfo);

  if (library && chainId && currencyToken) {
    return (
      <ConnectedListNftWidget
        library={library}
        chainId={chainId}
        currencyToken={currencyToken}
        className={className}
      />
    );
  }

  return null;
  // return <DisconnectedCollectionWidget className={className} />;
};

export default ListNftWidget;
