import { FC, ReactElement } from 'react';

import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import { Address } from '../../../../entities/Address/Address';
import { routes } from '../../../../routes';

import './OwnersListItem.scss';

interface OwnerListItemProps {
  owner: Address;
  className?: string;
}

const OwnersListItem: FC<OwnerListItemProps> = ({ owner, className = '' }): ReactElement => {
  const listItemClassName = classNames('owners-list-item', {
    'owners-list-item--is-loading': owner.isLoading,
  }, className);

  return (
    <li className={listItemClassName}>
      <NavLink
        to={routes.profile(owner.address)}
        className="owners-list-item__nav-link"
      >
        <div className="owners-list-item__address">{owner.address}</div>
        <div className="owners-list-item__ens-address">{owner.ens}</div>
      </NavLink>
    </li>
  );
};

export default OwnersListItem;
