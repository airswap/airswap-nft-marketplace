import { FC, ReactElement } from 'react';

import Checkbox, { CheckboxProps } from '../../components/Checkbox/Checkbox';
import Icon from '../../components/Icon/Icon';

import './CheckboxGroup.scss';

interface CheckboxGroupCheckbox extends CheckboxProps {
  key: string;
}

interface CheckboxGroupProps {
  checkboxes: CheckboxGroupCheckbox[],
  label: string;
  className?: string;
}

const CheckboxGroup: FC<CheckboxGroupProps> = ({ checkboxes, label, className = '' }): ReactElement => (
  <details className={`checkbox-group ${className}`}>
    <summary className="checkbox-group__summary">
      {label}

      <Icon
        name="chevron-down"
        className="checkbox-group__summary-icon"
      />
    </summary>

    <ul className="checkbox-group__list">
      {checkboxes.map(checkbox => (
        <li
          key={checkbox.key}
          className="checkbox-group__list-item"
        >
          <Checkbox {...checkbox} />
        </li>
      ))}
    </ul>
  </details>
);

export default CheckboxGroup;
