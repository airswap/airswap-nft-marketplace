import {
  DetailsHTMLAttributes,
  FC,
  PropsWithChildren,
  ReactElement, useEffect, useRef,
} from 'react';

import { useWindowSize } from 'react-use';

import Icon from '../Icon/Icon';

import './Details.scss';

interface DetailsProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  summary: string;
  className?: string;
}

const Details: FC<PropsWithChildren<DetailsProps>> = ({
  summary,
  className = '',
  children,
  ...detailsProps
}): ReactElement => {
  const ref = useRef<HTMLDetailsElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (ref.current) {
      ref.current.open = true;
    }
  }, [ref, width]);

  return (
    <details
      {...detailsProps}
      ref={ref}
      className={`details ${className}`}
    >
      <summary className="details__summary">
        {summary}

        <Icon name="chevron-down" className="details__summary-icon" />
      </summary>

      <div className="details__content">
        {children}
      </div>
    </details>
  );
};

export default Details;
