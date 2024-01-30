import React, {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';

import { CollectionTokenInfo, TokenInfo } from '@airswap/types';
import { BaseProvider } from '@ethersproject/providers';
import classNames from 'classnames';
import { useToggle } from 'react-use';

import Details from '../../../../components/Details/Details';
import ConnectedActivityList from '../../../../connectors/ConnectedActivityList/ConnectedActivityList';
import ConnectedOwnersList from '../../../../connectors/ConnectedOwnersList/ConnectedOwnersList';
import { isFullOrderExpired } from '../../../../entities/FullOrder/FullOrderHelpers';
import useAddressOrEnsName from '../../../../hooks/useAddressOrEnsName';
import useCollectionImage from '../../../../hooks/useCollectionImage';
import useNftTokenOwners from '../../../../hooks/useNftTokenOwners';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getNftOrderByTokenId } from '../../../../redux/stores/nftDetail/nftDetailApi';
import { reset } from '../../../../redux/stores/nftDetail/nftDetailSlice';
import { routes } from '../../../../routes';
import NftDetailAttributes from '../NftDetailAttributes/NftDetailAttributes';
import NftDetailList from '../NftDetailList/NftDetailList';
import NftDetailMainInfo from '../NftDetailMainInfo/NftDetailMainInfo';
import NftDetailPortrait from '../NftDetailPortrait/NftDetailPortrait';
import NftDetailProceedButton from '../NftDetailProceedButton/NftDetailProceedButton';
import NftDetailSaleInfo from '../NftDetailSaleInfo/NftDetailSaleInfo';

interface ConnectedNftDetailWidgetProps {
  accountIsOwner: boolean;
  collectionTokenInfo: CollectionTokenInfo;
  currencyTokenInfo: TokenInfo;
  library: BaseProvider;
  className?: string;
}

const ConnectedNftDetailWidget: FC<ConnectedNftDetailWidgetProps> = ({
  accountIsOwner,
  collectionTokenInfo,
  currencyTokenInfo,
  library,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const activityListRef = useRef<HTMLDivElement>(null);
  const { bannerImage } = useCollectionImage();

  const { chainId, collectionToken } = useAppSelector((state) => state.config);
  const { account } = useAppSelector((state) => state.web3);

  const { protocolFee } = useAppSelector(state => state.metadata);
  const { isLoading: isPriceLoading, order } = useAppSelector(state => state.nftDetail);

  const [showOwnersModal, toggleShowOwnersModal] = useToggle(false);
  const [showActivityList, setShowActivityList] = useState(false);

  const [owner, ownersLength, isOwnerLoading] = useNftTokenOwners(collectionTokenInfo);

  const isLoading = isPriceLoading || isOwnerLoading;
  const isExpired = order ? isFullOrderExpired(order) : false;
  const readableOwnerAddress = useAddressOrEnsName(owner, true);
  const accountRoute = owner ? routes.profile(owner) : undefined;
  const orderRoute = order ? routes.orderDetail(order.signer.wallet, order.nonce) : undefined;
  const listRoute = (accountIsOwner && !order) ? routes.listNft(collectionTokenInfo.id) : undefined;
  const showButton = (orderRoute || listRoute) && ownersLength && account && !isLoading;

  const wrapperClassName = classNames('nft-detail-widget', {
    'nft-detail-widget--has-button': showButton,
  }, className);

  useEffect(() => {
    dispatch(getNftOrderByTokenId({ tokenId: collectionTokenInfo.id, provider: library }));

    return () => {
      dispatch(reset());
    };
  }, [collectionTokenInfo, library]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShowActivityList(true);
        }
      });
    });

    if (activityListRef.current) {
      observer.observe(activityListRef.current);
    }

    return () => {
      if (activityListRef.current) {
        observer.unobserve(activityListRef.current);
      }
    };
  }, [activityListRef]);

  return (
    <div className={wrapperClassName}>
      <div className="nft-detail-widget__main-info">
        <NftDetailMainInfo
          accountRoute={accountRoute}
          description={collectionTokenInfo.description}
          owner={readableOwnerAddress}
          ownersLength={ownersLength}
          title={collectionTokenInfo.name}
          onOwnersButtonClick={toggleShowOwnersModal}
        />

        <NftDetailSaleInfo
          isLoading={isLoading}
          order={order}
          tokenInfo={currencyTokenInfo}
          className="nft-detail-widget__main-info-price"
        />

        {showButton && (
          <NftDetailProceedButton
            accountIsOwner={accountIsOwner}
            isExpired={isExpired}
            orderRoute={orderRoute}
            listRoute={listRoute}
          />
        )}
      </div>

      <NftDetailPortrait
        id={collectionTokenInfo.id}
        backgroundImage={collectionTokenInfo.image || bannerImage}
        className="nft-detail-widget__portrait"
      />

      <NftDetailSaleInfo
        isLoading={isLoading}
        order={order}
        tokenInfo={currencyTokenInfo}
        className="nft-detail-widget__price"
      />

      <Details
        summary="Description"
        className="nft-detail-widget__description"
      >
        <p>{collectionTokenInfo.description}</p>
      </Details>

      <Details
        summary="Properties"
        className="nft-detail-widget__attributes"
      >
        <NftDetailAttributes attrs={collectionTokenInfo.attributes} />
      </Details>

      <Details
        summary="Item activity"
        className="nft-detail-widget__activity"
      >
        <div
          ref={activityListRef}
          className="nft-detail-widget__activity-list-wrapper"
        >
          <ConnectedActivityList
            isEnabled={showActivityList}
            tokenId={collectionTokenInfo.id}
          />
        </div>
      </Details>

      <Details
        summary="Details"
        className="nft-detail-widget__details"
      >
        <NftDetailList
          address={collectionToken}
          chainId={chainId}
          fee={protocolFee / 100}
          id={collectionTokenInfo.id}
          standard={collectionTokenInfo.kind}
        />
      </Details>

      {showOwnersModal && (
        <ConnectedOwnersList
          library={library}
          tokenId={collectionTokenInfo.id}
          onClose={toggleShowOwnersModal}
        />
      )}
    </div>
  );
};

export default ConnectedNftDetailWidget;
