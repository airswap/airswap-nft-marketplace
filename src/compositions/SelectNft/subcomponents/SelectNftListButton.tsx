import { CSSProperties, FC, ReactElement } from 'react';

import classNames from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useElementSize } from 'usehooks-ts';

import Button from '../../../components/Button/Button';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';

import './SelectNftListButton.scss';

interface SelectNftButtonProps {
  isListed?: boolean;
  isLoading?: boolean;
  isPreview?: boolean;
  balance?: string;
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
  balance,
  logoURI,
  name,
  value,
  onClick,
  className = '',
}): ReactElement => {
  const [balanceElementRef, { width }] = useElementSize();

  const buttonClassNames = classNames('select-nft-list-button', {
    'select-nft-list-button--is-preview': isPreview,
    'select-nft-list-button--has-balance': balance,
  }, className);

  const cssVariables = {
    '--select-nft-list-button-balance-width': `${width}px`,
  } as CSSProperties;

  return (
    <Button
      style={cssVariables}
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

      {!!balance && <div ref={balanceElementRef} className="select-nft-list-button__balance">{`${balance}x`}</div>}
    </Button>
  );
};

export default SelectNftListButton;
