import { FC, ReactElement } from 'react';

import Button from '../../../components/Button/Button';

import './SelectNftListButton.scss';

interface SelectNftButtonProps {
  isListed?: boolean;
  logoURI: string;
  name: string;
  value: string;
  onClick: (value: string) => void;
  className?: string;
}

const SelectNftListButton: FC<SelectNftButtonProps> = ({
  isListed,
  logoURI,
  name,
  value,
  onClick,
  className = '',
}): ReactElement => (
  <Button
    onClick={() => onClick(value)}
    className={`select-nft-list-button ${className}`}
  >
    <div className="select-nft-list-button__logo-icon" style={{ backgroundImage: `url("${logoURI}")` }} />
    <div className="select-nft-list-button__name-and-listed">
      <div className="select-nft-list-button__name">{name}</div>
      {isListed && <div className="select-nft-list-button__listed">Listed</div>}
    </div>
  </Button>
);

export default SelectNftListButton;
