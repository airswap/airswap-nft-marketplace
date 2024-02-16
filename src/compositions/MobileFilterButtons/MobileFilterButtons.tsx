import { FC, ReactElement } from 'react';

import Button from '../../components/Button/Button';

import './MobileFilterButtons.scss';

interface MobileFilterButtonsProps {
  amountOfFilters?: number;
  onCloseButtonClick: () => void;
  onResetFiltersButtonClick: () => void;
  className?: string;
}

const MobileFilterButtons: FC<MobileFilterButtonsProps> = ({
  amountOfFilters,
  onCloseButtonClick,
  onResetFiltersButtonClick,
  className = '',
}): ReactElement => (
  <div className={`mobile-filter-buttons ${className}`}>
    <Button
      type="button"
      onClick={onResetFiltersButtonClick}
      className="mobile-filter-buttons__clear-button"
    >
      Clear all
    </Button>

    {amountOfFilters ? (
      <Button
        type="button"
        onClick={onCloseButtonClick}
        className="mobile-filter-buttons__apply-button"
      >
        {`Apply filters ${amountOfFilters ? `(${amountOfFilters})` : ''}`}
      </Button>
    ) : (
      <Button
        type="button"
        onClick={onCloseButtonClick}
        className="mobile-filter-buttons__close-button"
      >
        Close
      </Button>
    )}
  </div>
);

export default MobileFilterButtons;
