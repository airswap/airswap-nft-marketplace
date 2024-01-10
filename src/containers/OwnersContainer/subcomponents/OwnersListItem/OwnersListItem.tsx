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
    'owners-list-item--has-no-ens': !owner.ens,
  }, className);

  return (
    <li className={listItemClassName}>
      <NavLink
        to={routes.profile(owner.address)}
        className="owners-list-item__nav-link"
      >
        <div className="owners-list-item__ens-address">{owner.ens || 'Unnamed'}</div>
        <div className="owners-list-item__address">{owner.address}</div>
      </NavLink>
    </li>
  );
};

export default OwnersListItem;
