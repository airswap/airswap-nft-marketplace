import React, { FC, useEffect, useState } from 'react';

import Icon from '../../components/Icon/Icon';
import { SelectOption } from '../../types/SelectOption';
import IconButton from '../IconButton/IconButton';
import DropdownButton from './subcomponents/DropdownButton/DropdownButton';

import './Dropdown.scss';

export type DropdownProps = {
  selectedOption: SelectOption;
  options: SelectOption[];
  onChange: (option: SelectOption) => void;
  className?: string;
  buttonClassName?: string;
};

const Dropdown: FC<DropdownProps> = ({
  selectedOption,
  options,
  onChange,
  className = '',
  buttonClassName = '',
}) => {
  // activeOptionIndex is used for styling SelectOptions vertical position. This way
  // the active option in SelectOptions always opens directly on top of the Select.
  const [activeOptionIndex, setActiveOptionIndex] = useState(
    options.findIndex((option) => option.value === selectedOption.value),
  );

  // activeHoverIndex is for setting the hover effect element position. It is animated
  // so it's a separate div element.
  const [activeHoverIndex, setActiveHoverIndex] = useState(activeOptionIndex);

  const handleOptionClick = (newSelectedOption: SelectOption) => {
    onChange(newSelectedOption);
  };

  const handleButtonBlur = () => {
    const index = options.findIndex(option => option.value === selectedOption.value);
    setActiveOptionIndex(index);
    setActiveHoverIndex(index);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Unlike other browsers, on safari clicking a button won't focus it.
    e.currentTarget.focus();
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedOption = options.find(option => option.value === e.target.value);

    if (newSelectedOption) {
      onChange(newSelectedOption);
    }
  };

  useEffect(() => {
    setActiveOptionIndex(options.findIndex((option) => option.value === selectedOption.value));
  }, [selectedOption]);

  return (
    <div className={`dropdown ${className}`}>
      <IconButton
        iconAlign="right"
        icon="chevron-down"
        text={selectedOption.label}
        onBlur={handleButtonBlur}
        onClick={handleButtonClick}
        className={`dropdown__button ${buttonClassName}`}
      />
      <div
        style={{ transform: `translateY(${activeOptionIndex * -(100 / options.length)}%)` }}
        className="dropdown__options-container"
      >
        {options.map((option, index) => (
          <DropdownButton
            isActive={activeHoverIndex === index}
            key={option.value}
            option={option}
            onMouseOver={() => setActiveHoverIndex(index)}
            onPointerDown={() => handleOptionClick(option)}
            className="dropdown__dropdown-button"
          />
        ))}
        <div
          style={{ transform: `translateY(calc(${activeHoverIndex * 100}% - ${activeHoverIndex}px)` }}
          className="dropdown__dropdown-button-background"
        />
      </div>
      {/* Native Select for mobile */}
      <select
        value={selectedOption.value}
        className={`dropdown__select ${buttonClassName}`}
        onChange={handleSelectChange}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevron-down"
        className="dropdown__select-icon"
      />
    </div>
  );
};

export default Dropdown;
