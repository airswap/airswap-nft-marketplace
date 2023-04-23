import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';

import { expiryAmounts } from '../../../../constants/expiry';
import { AppErrorType, isAppError } from '../../../../errors/appError';
import useCollectionToken from '../../../../hooks/useCollectionToken';
import useInsufficientAmount from '../../../../hooks/useInsufficientAmount';
import useNftTokenApproval from '../../../../hooks/useNftTokenApproval';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { createNftOrder } from '../../../../redux/stores/listNft/listNftActions';
import { approve as approveNft } from '../../../../redux/stores/orders/ordersActions';
import { ExpiryTimeUnit } from '../../../../types/ExpiryTimeUnit';
import { getTitle } from '../../helpers';
import useTokenAmountAndFee from '../../hooks/useTokenAmountAndFee';
import ListActionButtons from '../ListActionButtons/ListActionButtons';
import ListNftDetailContainer from '../ListNftDetailsContainer/ListNftDetailsContainer';
import ListNftWidgetHeader from '../ListNftWidgetHeader/ListNftWidgetHeader';

import '../../ListNftWidget.scss';

export enum ListNftState {
  details = 'details',
  review = 'review',
  approve = 'approve',
  approving = 'approving',
  sign = 'sign',
  listing = 'listing',
  success = 'success',
  failed = 'failed',
}

interface ListNftWidgetProps {
  account: string;
  chainId: number;
  currencyTokenInfo: TokenInfo;
  library: Web3Provider
  className?: string;
}

const ConnectedListNftWidget: FC<ListNftWidgetProps> = ({
  account,
  chainId,
  currencyTokenInfo,
  library,
  className = '',
}) => {
  const dispatch = useAppDispatch();

  // Store data
  const { tokens: userTokens } = useAppSelector(state => state.balances);
  const { error: ordersError } = useAppSelector(state => state.orders);
  const { error: listNftError } = useAppSelector(state => state.listNft);
  const { collectionImage, collectionToken } = useAppSelector(state => state.config);
  const { protocolFee, projectFee } = useAppSelector(state => state.metadata);
  const { lastUserOrder } = useAppSelector(state => state.listNft);

  // User input states
  const [widgetState, setWidgetState] = useState<ListNftState>(ListNftState.details);
  const [selectedTokenId, setSelectedTokenId] = useState(userTokens[0]);
  const [currencyTokenAmount, setCurrencyTokenAmount] = useState('0');
  const [expiryTimeUnit, setExpiryTimeUnit] = useState(ExpiryTimeUnit.minutes);
  const [expiryAmount, setExpiryAmount] = useState<number | undefined>(60);

  // States derived from user input
  const collectionTokenInfo = useCollectionToken(collectionToken, selectedTokenId);
  const [currencyTokenAmountMinusProtocolFee, protocolFeeInCurrencyToken] = useTokenAmountAndFee(currencyTokenAmount);
  const hasInsufficientAmount = useInsufficientAmount(currencyTokenAmount);
  const hasInsufficientExpiryAmount = !expiryAmount || expiryAmount < 0;
  const hasCollectionTokenApproval = useNftTokenApproval(collectionTokenInfo, selectedTokenId);
  const title = useMemo(() => getTitle(widgetState), [widgetState]);

  const handleActionButtonClick = async () => {
    if (widgetState === ListNftState.details) {
      setWidgetState(ListNftState.review);
    }

    if (widgetState === ListNftState.review && collectionTokenInfo && !hasCollectionTokenApproval) {
      setWidgetState(ListNftState.approve);

      dispatch(approveNft({
        tokenInfo: collectionTokenInfo,
        library,
        chainId,
        tokenId: selectedTokenId,
      }))
        .unwrap()
        .then(() => {
          setWidgetState(ListNftState.approving);
        })
        .catch((e) => {
          if (isAppError(e) && e.type === AppErrorType.rejectedByUser) {
            setWidgetState(ListNftState.review);
          } else {
            setWidgetState(ListNftState.failed);
          }
        });
    }

    if (widgetState === ListNftState.review && collectionTokenInfo && hasCollectionTokenApproval) {
      setWidgetState(ListNftState.sign);

      const expiryDate = Date.now() + (expiryAmounts[expiryTimeUnit] * (expiryAmount || 1));

      dispatch(createNftOrder({
        expiry: Math.floor(expiryDate / 1000).toString(),
        library,
        signerWallet: account,
        signerTokenInfo: collectionTokenInfo,
        protocolFee,
        senderTokenInfo: currencyTokenInfo,
        senderAmount: currencyTokenAmount,
        tokenId: selectedTokenId,
      })).unwrap()
        .then(() => {
          setWidgetState(ListNftState.success);
        })
        .catch((e) => {
          if (isAppError(e) && e.type === AppErrorType.rejectedByUser) {
            setWidgetState(ListNftState.review);
          } else {
            setWidgetState(ListNftState.failed);
          }
        });
    }
  };

  const handleSelectedNftChange = (value: number) => {
    setSelectedTokenId(value);
  };

  useEffect(() => {
    if (hasCollectionTokenApproval && widgetState === ListNftState.approving) {
      setWidgetState(ListNftState.review);
    }
  }, [widgetState, hasCollectionTokenApproval]);

  useEffect(() => {
    setSelectedTokenId(userTokens[0]);
  }, [userTokens]);

  if (!userTokens.length) {
    return (
      <div className={`list-nft-widget ${className}`}>
        <h1>List NFT</h1>
        You have no nfts to list
      </div>
    );
  }

  return (
    <div className={`list-nft-widget ${className}`}>
      <ListNftWidgetHeader
        title={title}
        className="list-nft-widget__header"
      />

      <ListNftDetailContainer
        collectionImage={collectionImage}
        collectionTokenInfo={collectionTokenInfo}
        currencyTokenAmount={currencyTokenAmount}
        currencyTokenAmountMinusProtocolFee={currencyTokenAmountMinusProtocolFee}
        currencyTokenInfo={currencyTokenInfo}
        error={listNftError || ordersError}
        expiryAmount={expiryAmount}
        expiryTimeUnit={expiryTimeUnit}
        fullOrder={lastUserOrder}
        projectFee={projectFee}
        protocolFee={protocolFee}
        protocolFeeInCurrencyToken={protocolFeeInCurrencyToken}
        selectedTokenId={selectedTokenId}
        userTokens={userTokens}
        widgetState={widgetState}
        onExpiryAmountChange={setExpiryAmount}
        onExpiryTimeUnitChange={setExpiryTimeUnit}
        onSelectedNftChange={handleSelectedNftChange}
        onTradeTokenInputChange={setCurrencyTokenAmount}
        className="list-nft-widget__trade-details-container"
      />

      {!(widgetState === ListNftState.sign || widgetState === ListNftState.approve || widgetState === ListNftState.approving) && (
        <ListActionButtons
          hasNoCollectionTokenApproval={!hasCollectionTokenApproval}
          hasInsufficientAmount={hasInsufficientAmount}
          hasInsufficientExpiryAmount={hasInsufficientExpiryAmount}
          currencyToken={currencyTokenInfo}
          fullOrder={lastUserOrder}
          state={widgetState}
          onActionButtonClick={handleActionButtonClick}
          className="list-nft-widget__action-buttons"
        />
      )}
    </div>
  );
};

export default ConnectedListNftWidget;
