import React, { FC, useEffect, useMemo } from 'react';

import { CollectionTokenInfo, TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';

import Accordion from '../../../../components/Accordion/Accordion';
import { getFullOrderReadableSenderAmountPlusTotalFees } from '../../../../entities/FullOrder/FullOrderHelpers';
import useAddressOrEnsName from '../../../../hooks/useAddressOrEnsName';
import useNftTokenOwner from '../../../../hooks/useNftTokenOwner';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getNftOrderByTokenId, getNftTransactionReceipts } from '../../../../redux/stores/nftDetail/nftDetailApi';
import { reset } from '../../../../redux/stores/nftDetail/nftDetailSlice';
import { routes } from '../../../../routes';
import NftDetailActivity from '../NftDetailActivity/NftDetailActivity';
import NftDetailAttributes from '../NftDetailAttributes/NftDetailAttributes';
import NftDetailContentContainer from '../NftDetailContentContainer/NftDetailContentContainer';
import NftDetailList from '../NftDetailList/NftDetailList';
import NftDetailMainInfo from '../NftDetailMainInfo/NftDetailMainInfo';
import NftDetailPortrait from '../NftDetailPortrait/NftDetailPortrait';
import NftDetailProceedButton from '../NftDetailProceedButton/NftDetailProceedButton';
import NftDetailSaleInfo from '../NftDetailSaleInfo/NftDetailSaleInfo';

interface ConnectedNftDetailWidgetProps {
  collectionTokenInfo: CollectionTokenInfo;
  currencyTokenInfo: TokenInfo;
  library: Web3Provider;
  className?: string;
}

const ConnectedNftDetailWidget: FC<ConnectedNftDetailWidgetProps> = ({
  collectionTokenInfo,
  currencyTokenInfo,
  library,
  className = '',
}) => {
  const dispatch = useAppDispatch();

  const { chainId, collectionToken, collectionImage } = useAppSelector((state) => state.config);
  const { account } = useAppSelector((state) => state.web3);

  const { protocolFee } = useAppSelector(state => state.metadata);
  const { isLoading, order, transactionLogs } = useAppSelector(state => state.nftDetail);

  const price = useMemo(() => (order ? getFullOrderReadableSenderAmountPlusTotalFees(order, currencyTokenInfo) : undefined), [order]);
  const owner = useNftTokenOwner(collectionTokenInfo);
  const readableOwnerAddress = useAddressOrEnsName(owner, true);
  const accountRoute = owner ? routes.profile(owner) : undefined;
  const orderRoute = order ? routes.orderDetail(order.signer.wallet, order.nonce) : undefined;

  useEffect(() => {
    dispatch(getNftOrderByTokenId(collectionTokenInfo.id));
    dispatch(getNftTransactionReceipts({ provider: library, tokenId: collectionTokenInfo.id }));

    return () => {
      dispatch(reset());
    };
  }, [collectionTokenInfo]);

  return (
    <div className={`nft-detail-widget ${className}`}>
      <NftDetailContentContainer className="nft-detail-widget__mobile-view">
        <NftDetailMainInfo
          accountRoute={accountRoute}
          owner={readableOwnerAddress}
          title={collectionTokenInfo.name}
          className="nft-detail-widget__main-info"
        />
        <NftDetailPortrait
          backgroundImage={collectionTokenInfo.image || collectionImage}
          className="nft-detail-widget__portrait"
        />
        <NftDetailSaleInfo
          isLoading={isLoading}
          price={price}
          symbol={currencyTokenInfo.symbol}
          className="nft-detail-widget__price"
        />
        <Accordion
          label="Description"
          content={(
            <p>{collectionTokenInfo.description}</p>
          )}
          className="nft-detail-widget__description-accordion"
          isDefaultOpen
        />
        {(orderRoute && owner) && (
          <NftDetailProceedButton
            accountIsOwner={account === owner}
            route={orderRoute}
          />
        )}
        <Accordion
          label="Properties"
          content={(
            <NftDetailAttributes attrs={collectionTokenInfo.attributes} />
          )}
          className="nft-detail-widget__properties-accordion"
          isDefaultOpen
        />
        <Accordion
          label="Details"
          content={(
            <NftDetailList
              address={collectionToken}
              id={collectionTokenInfo.id}
              chainId={chainId}
              standard={collectionTokenInfo.kind}
              fee={protocolFee / 100}
            />
          )}
          className="nft-detail-widget__description-accordion"
        />
        <Accordion
          label="Item Activity"
          content={(
            <NftDetailActivity
              chainId={chainId}
              logs={transactionLogs}
            />
          )}
          className="nft-detail-widget__description-accordion"
        />
      </NftDetailContentContainer>
      <NftDetailContentContainer className="nft-detail-widget__desktop-view">
        <div className="nft-detail-widget__column">
          <NftDetailPortrait
            backgroundImage={collectionTokenInfo.image || collectionImage}
            className="nft-detail-widget__portrait"
          />
          <div className="nft-detail-widget__meta-container">
            <h2 className="nft-detail-widget__meta-container-label">Details</h2>
            <div className="accordion__content accordion__content--has-border">
              <NftDetailList
                address={collectionToken}
                id={collectionTokenInfo.id}
                chainId={chainId}
                standard={collectionTokenInfo.kind}
                fee={protocolFee / 100}
              />
            </div>
          </div>
          <div className="nft-detail-widget__meta-container">
            <h2 className="nft-detail-widget__meta-container-label">Item activity</h2>
            <div className="accordion__content accordion__content--has-border">
              <NftDetailActivity
                chainId={chainId}
                logs={transactionLogs}
              />
            </div>
          </div>
          <div className="nft-detail-widget__meta-container">
            <NftDetailAttributes attrs={collectionTokenInfo.attributes} />
          </div>
        </div>
        <div className="nft-detail-widget__column">
          <NftDetailMainInfo
            accountRoute={accountRoute}
            owner={readableOwnerAddress}
            title={collectionTokenInfo.name}
            className="nft-detail-widget__main-info"
          />
          <div className="nft-detail-widget__meta-container">
            <h2 className="nft-detail-widget__meta-container-label">Description</h2>
            <p>{collectionTokenInfo.description}</p>
          </div>
          <NftDetailSaleInfo
            isLoading={isLoading}
            price={price}
            symbol={currencyTokenInfo.symbol}
            className="nft-detail-widget__price"
          />
          {(orderRoute && owner) && (
            <NftDetailProceedButton
              accountIsOwner={account === owner}
              route={orderRoute}
            />
          )}
        </div>
      </NftDetailContentContainer>
    </div>
  );
};

export default ConnectedNftDetailWidget;
