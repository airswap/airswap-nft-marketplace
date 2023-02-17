import React, { FC, useRef, useState } from 'react';

import { useEventListener } from 'usehooks-ts';

import Icon from '../Icon/Icon';

import './Accordion.scss';

interface AccordionProps {
  isDefaultOpen?: boolean;
  content: string | JSX.Element;
  label: string;
  className?: string;
}

const Accordion: FC<AccordionProps> = ({
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
    <div className={`accordion ${className}`}>
      <button className="accordion__header focus:outline-none" ref={headerRef} type="button">
        <p className="accordion__label">{label}</p>
        <span className="accordion__state-indicator" style={{ transform: `rotate(${isOpen ? 0 : 180}deg)` }}><Icon className="accordion__state-indicator" name="chevron-down" /></span>
      </button>
      <div className={`accordion__content ${isOpen ? 'accordion__content--is-open' : ''}`}>
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
    </div>
  );
};

export default Accordion;
