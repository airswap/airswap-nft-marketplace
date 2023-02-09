import React, { FC, useRef, useState } from 'react';

import { useEventListener } from 'usehooks-ts';

import Icon from '../Icon/Icon';

import './Accordian.scss';

interface AccordianProps {
  isDefaultOpen?: boolean;
  content: string | JSX.Element;
  label: string;
  className?: string;
}

const Accordian: FC<AccordianProps> = ({
  isDefaultOpen = false,
  content,
  label,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(isDefaultOpen);
  const headerRef = useRef(null);
  const onClick = () => {
    setIsOpen(!isOpen);
  };

  useEventListener('click', onClick, headerRef);
  return (
    <div className={`accordian ${className}`}>
      <div className="accordian__header" ref={headerRef}>
        <p className="accordian__label">{label}</p>
        <span className="accordian__state-indicator" style={{ transform: `rotate(${isOpen ? 0 : 180}deg)` }}><Icon className="accordian__state-indicator" name="chevron-down" /></span>
      </div>
      <div className={`accordian__content ${isOpen ? 'accordian__content--is-open' : ''}`}>
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
    </div>
  );
};

export default Accordian;
