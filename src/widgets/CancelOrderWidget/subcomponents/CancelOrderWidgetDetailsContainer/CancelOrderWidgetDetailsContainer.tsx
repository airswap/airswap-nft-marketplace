import { FC, ReactElement, useMemo } from 'react';

import { CollectionTokenInfo, FullOrder, TokenInfo } from '@airswap/types';

import ExpiryDateInfo from '../../../../components/ExpiryDateInfo/ExpiryDateInfo';
import Icon from '../../../../components/Icon/Icon';
import ReviewNftDetails from '../../../../components/ReviewNftDetails/ReviewNftDetails';
import ReviewTokenDetails from '../../../../components/ReviewTokenDetails/ReviewTokenDetails';
import {
  getFullOrderExpiryDate,
  getFullOrderReadableSenderAmount,
  getFullOrderReadableSenderAmountPlusTotalFees,
} from '../../../../entities/FullOrder/FullOrderHelpers';
import SwapIcon from '../../../ListNftWidget/subcomponents/SwapIcon/SwapIcon';
import { CancelOrderState } from '../ConnectedCancelOrderWidget/ConnectedCancelOrderWidget';

import './CancelOrderWidgetDetailsContainer.scss';

interface CancelOrderWidgetDetailsContainerProps {
  collectionImage: string;
  collectionTokenInfo?: CollectionTokenInfo;
  currencyTokenInfo: TokenInfo;
  fullOrder: FullOrder;
  projectFee: number;
  protocolFee: number;
  widgetState: CancelOrderState;
  className?: string;
}

const CancelOrderWidgetDetailsContainer: FC<CancelOrderWidgetDetailsContainerProps> = ({
  collectionImage,
  collectionTokenInfo,
  currencyTokenInfo,
  fullOrder,
  projectFee,
  protocolFee,
  widgetState,
  className = '',
}): ReactElement => {
  const expiryDate = useMemo(() => getFullOrderExpiryDate(fullOrder), [fullOrder]);
  const readableSenderAmountPlusFees = useMemo(() => getFullOrderReadableSenderAmountPlusTotalFees(fullOrder, currencyTokenInfo), [fullOrder, currencyTokenInfo]);
  const readableSenderAmount = useMemo(() => getFullOrderReadableSenderAmount(fullOrder, currencyTokenInfo), [fullOrder, currencyTokenInfo]);

  return (
    <div className={`cancel-order-widget-details-container ${className}`}>
      {widgetState === CancelOrderState.details && (
        <>
          <div className="cancel-order-widget-details-container__intro">
            <Icon
              name="information-circle-outline"
              className="cancel-order-widget-details-container__info-icon"
            />
            To change the price of your NFT it is required to cancel the current listing.
          </div>
          <ReviewNftDetails
            logoURI={collectionTokenInfo ? collectionTokenInfo.image : collectionImage}
            title="Cancel"
            token={collectionTokenInfo}
            className="cancel-order-widget-details-container__review-nft-details"
          />
          <SwapIcon className="cancel-order-widget-details-container__swap-icon" />
          <ReviewTokenDetails
            amount={readableSenderAmountPlusFees}
            amountMinusProtocolFee={readableSenderAmount}
            projectFeePercent={projectFee / 100}
            protocolFeePercent={protocolFee / 100}
            title="For"
            token={currencyTokenInfo}
          />
          <ExpiryDateInfo
            expiry={expiryDate}
            className="cancel-order-widget-details-container__expiry-date-info"
          />
        </>
      )}
    </div>
  );
};

export default CancelOrderWidgetDetailsContainer;
