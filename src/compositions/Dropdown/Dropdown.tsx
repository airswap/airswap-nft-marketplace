import React, {
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Icon from '../../components/Icon/Icon';
import { SelectOption } from '../../types/SelectOption';
import IconButton from '../IconButton/IconButton';
import { getDropdownOptionsTranslateY } from './helpers/getDropdownOptionsTranslateY';
import DropdownButton from './subcomponents/DropdownButton/DropdownButton';

import './Dropdown.scss';

export type DropdownProps = {
  selectedOption: SelectOption;
  options: SelectOption[];
  onBlur?: () => void;
  onChange: (option: SelectOption) => void;
  onFocus?: () => void;
  className?: string;
  buttonClassName?: string;
  dropdownButtonClassName?: string;
  dropdownButtonBackgroundClassName?: string;
  mobileSelectIconClassName?: string;
};

const Dropdown: FC<DropdownProps> = ({
  selectedOption,
  options,
  onBlur,
  onChange,
  onFocus,
  className = '',
  buttonClassName = '',
  dropdownButtonClassName = '',
  dropdownButtonBackgroundClassName = '',
  mobileSelectIconClassName = '',
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // activeOptionIndex is used for styling SelectOptions vertical position. This way
  // the active option in SelectOptions always opens directly on top of the Select.
  const [activeOptionIndex, setActiveOptionIndex] = useState(
    options.findIndex((option) => option.value === selectedOption.value),
  );

  // activeHoverIndex is for setting the hover effect element position. It is animated
  // so it's a separate div element.
  const [activeHoverIndex, setActiveHoverIndex] = useState(activeOptionIndex);

  const optionsTranslateY = useMemo(() => {
    const optionsHeight = optionsRef.current?.clientHeight || 0;
    const wrapperPosY = wrapperRef.current?.getBoundingClientRect().y || 0;

    return getDropdownOptionsTranslateY(
      optionsHeight,
      wrapperPosY,
      activeOptionIndex,
      options.length,
    );
  }, [options, activeOptionIndex]);

  const handleOptionClick = (newSelectedOption: SelectOption) => {
    onChange(newSelectedOption);
  };

  const handleButtonBlur = () => {
    const index = options.findIndex(option => option.value === selectedOption.value);
    setActiveOptionIndex(index);
    setActiveHoverIndex(index);

    if (onBlur) {
      onBlur();
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Unlike other browsers, on safari clicking a button won't focus it.
    e.currentTarget.focus();

    if (onFocus) {
      onFocus();
    }
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
    <div
      ref={wrapperRef}
      className={`dropdown ${className}`}
    >
      <IconButton
        iconAlign="right"
        icon="chevron-down"
        text={selectedOption.label}
        onBlur={handleButtonBlur}
        onClick={handleButtonClick}
        onFocus={onFocus}
        className={`dropdown__button ${buttonClassName}`}
        iconClassName="dropdown__button-icon"
      />
      <div
        ref={optionsRef}
        style={{ transform: `translateY(${optionsTranslateY}%)` }}
        className="dropdown__options-container"
      >
        {options.map((option, index) => (
          <DropdownButton
            isActive={activeHoverIndex === index}
            key={option.value}
            option={option}
            onMouseOver={() => setActiveHoverIndex(index)}
            onPointerDown={() => handleOptionClick(option)}
            className={`dropdown__dropdown-button ${dropdownButtonClassName}`}
          />
        ))}
        <div
          style={{ transform: `translateY(calc(${activeHoverIndex * 100}% - ${activeHoverIndex}px)` }}
          className={`dropdown__dropdown-button-background ${dropdownButtonBackgroundClassName}`}
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
        className={`dropdown__mobile-select-icon ${mobileSelectIconClassName}`}
      />
    </div>
  );
};

export default Dropdown;
