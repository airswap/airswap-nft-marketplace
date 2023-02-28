import React, { FC } from 'react';

import Icon from '../Icon/Icon';
import Input from '../Input/Input';

import './SearchInput.scss';

type HTMLInputProps = JSX.IntrinsicElements['input'];

interface SearchInputProps extends HTMLInputProps {
  className?: string;
}

const SearchInput: FC<SearchInputProps> = ({ className = '', ...props }) => (
  <div className={`search-input ${className}`}>
    <Input
      {...props}
      type="text"
      className="search-input__input"
    />
    <Icon name="search" className="search-input__icon" />
  </div>
);

export default SearchInput;
