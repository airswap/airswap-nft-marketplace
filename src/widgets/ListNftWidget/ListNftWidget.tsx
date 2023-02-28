import React, { FC } from 'react';

import SearchInput from '../../components/SearchInput/SearchInput';
import SelectExpiry from '../../compositions/SelectExpiry/SelectExpiry';

import './ListNftWidget.scss';

const ListNftWidget: FC = () => (
  <div className="list-nft-widget">
    <h1>Select NFT to list</h1>
    <SearchInput
      placeholder="Search for NFT"
      className="list-nft-widget__search-input"
    />
    <SelectExpiry className="list-nft-widget__select-expiry" />
  </div>
);

export default ListNftWidget;
