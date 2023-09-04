import { FC, ReactElement } from 'react';

import { CollectionTokenInfo, FullOrder, TokenInfo } from '@airswap/types';

import Icon from '../../../../components/Icon/Icon';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import NftCard from '../../../../components/NftCard/NftCard';
import { getFullOrderReadableSenderAmountPlusTotalFees } from '../../../../entities/FullOrder/FullOrderHelpers';
import { routes } from '../../../../routes';

import './OwnedNftsContainer.scss';

interface OwnedNftsContainerProps {
  isEndOfTokens: boolean;
  isLoading: boolean;
  currencyTokenInfo: TokenInfo;
  orders: FullOrder[];
  tokens: CollectionTokenInfo[];
  className?: string;
}

const OwnedNftsContainer: FC<OwnedNftsContainerProps> = ({
  isEndOfTokens,
  isLoading,
  currencyTokenInfo,
  orders,
  tokens,
  className = '',
}): ReactElement => (
  <div className={`owned-nfts-container ${className}`}>
    <div className="owned-nfts-container__tokens">
      {tokens.map((nft) => {
        const tokenOrder = orders.find(order => +order.signer.id === nft.id);
        const price = (tokenOrder && currencyTokenInfo) ? getFullOrderReadableSenderAmountPlusTotalFees(tokenOrder, currencyTokenInfo) : undefined;

        return (
          <NftCard
            key={nft.id}
            imageURI={nft.image}
            name={nft.name}
            price={price}
            to={routes.nftDetail(nft.id)}
            symbol={currencyTokenInfo?.symbol}
            className="profile-widget__nft-card"
          />
        );
      })}
    </div>
    {isLoading && <LoadingSpinner className="owned-nfts-container__loader" />}
    {(!isLoading && isEndOfTokens) && <Icon name="airswap" className="owned-nfts-container__end-of-orders-icon" />}
  </div>
);

export default OwnedNftsContainer;
