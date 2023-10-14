import React, { FC, useMemo } from 'react';

import IconButton from '../../../../compositions/IconButton/IconButton';
import IconNavLink from '../../../../compositions/IconNavLink/IconNavLink';
import { getTitle } from '../../helpers';
import { ListNftState } from '../ConnectedListNftWidget/ConnectedListNftWidget';

import './ListNftWidgetHeader.scss';

interface ListNftWidgetHeaderProps {
  state?: ListNftState;
  onBackButtonClick?: () => void;
  className?: string;
}

const ListNftWidgetHeader: FC<ListNftWidgetHeaderProps> = ({ state, onBackButtonClick, className = '' }) => {
  const title = useMemo(() => getTitle(state), [state]);

  return (
    <div className={`list-nft-widget-header ${className}`}>
      <h1 className="list-nft-widget-header__title">{title}</h1>
      { state === ListNftState.selectNft ? (
        <IconButton
          hideLabel
          icon="close"
          text="Back"
          onClick={onBackButtonClick}
          className="list-nft-widget-header__back-button"
        />
      ) : (
        <IconNavLink
          hideLabel
          icon="close"
          text="Back"
          to="/"
          className="list-nft-widget-header__back-button"
        />
      )}
    </div>
  );
};

export default ListNftWidgetHeader;
