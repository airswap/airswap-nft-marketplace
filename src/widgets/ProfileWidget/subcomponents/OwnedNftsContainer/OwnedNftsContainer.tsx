import { FC, ReactElement } from 'react';

import { CollectionTokenInfo, TokenInfo } from '@airswap/types';

import Icon from '../../../../components/Icon/Icon';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import NftCard from '../../../../components/NftCard/NftCard';
import { ExtendedFullOrder } from '../../../../entities/FullOrder/FullOrder';
import { getFullOrderReadableSenderAmountPlusTotalFees } from '../../../../entities/FullOrder/FullOrderHelpers';
import { TokenIdsWithBalance } from '../../../../entities/TokenIdsWithBalance/TokenIdsWithBalance';
import { routes } from '../../../../routes';

import './OwnedNftsContainer.scss';

interface OwnedNftsContainerProps {
  isEndOfTokens: boolean;
  isLoading: boolean;
  currencyTokenInfo: TokenInfo;
  highlightTokenId?: string;
  orders: ExtendedFullOrder[];
  tokenIdsWithBalance: TokenIdsWithBalance;
  tokens: CollectionTokenInfo[];
  className?: string;
}

const OwnedNftsContainer: FC<OwnedNftsContainerProps> = ({
  isEndOfTokens,
  isLoading,
  currencyTokenInfo,
  highlightTokenId,
  orders,
  tokenIdsWithBalance,
  tokens,
  className = '',
}): ReactElement => (
  <div className={`owned-nfts-container ${className}`}>
    <div className="owned-nfts-container__tokens">
      {tokens.map((nft) => {
        const balance = tokenIdsWithBalance[nft.id];
        const tokenOrder = orders.find(order => order.signer.id === nft.id);
        const price = (tokenOrder && currencyTokenInfo) ? getFullOrderReadableSenderAmountPlusTotalFees(tokenOrder, currencyTokenInfo) : undefined;
        const isHighlighted = highlightTokenId === nft.id;

        return (
          <NftCard
            key={nft.id}
            isHighlighted={isHighlighted}
            balance={(balance && balance !== '1') ? balance : undefined}
            id={nft.id}
            imageURI={nft.image}
            label={isHighlighted ? 'Newly bought' : undefined}
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
