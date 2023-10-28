import { FC, ReactElement } from 'react';

import classNames from 'classnames';

import Button from '../../../components/Button/Button';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';

import './SelectNftListButton.scss';

interface SelectNftButtonProps {
  isListed?: boolean;
  isLoading?: boolean;
  isPreview?: boolean;
  logoURI: string;
  name: string;
  value: string;
  onClick: (value: string) => void;
  className?: string;
}

const SelectNftListButton: FC<SelectNftButtonProps> = ({
  isListed,
  isLoading,
  isPreview,
  logoURI,
  name,
  value,
  onClick,
  className = '',
}): ReactElement => {
  const buttonClassNames = classNames('select-nft-list-button', {
    'select-nft-list-button--is-preview': isPreview,
  }, className);

  return (
    <Button
      onClick={() => onClick(value)}
      className={buttonClassNames}
    >
      {isLoading ? (
        <LoadingSpinner className="select-nft-list-button__loading-spinner" />
      ) : (
        <div className="select-nft-list-button__logo-icon" style={{ backgroundImage: `url("${logoURI}")` }} />
      )}
      <div className="select-nft-list-button__name-and-listed">
        <div className="select-nft-list-button__name">{name}</div>
        {isListed && <div className="select-nft-list-button__listed">Listed</div>}
      </div>
    </Button>
  );
};

export default SelectNftListButton;
