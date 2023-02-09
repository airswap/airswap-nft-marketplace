import React, { FC, useRef, useState } from 'react';

import { useEventListener } from 'usehooks-ts';

import './Accordian.scss';

interface AccordianProps {
  label: string;
  content: string | JSX.Element;
  isDefaultOpen?: boolean;
  className?: string;
}

const Accordian: FC<AccordianProps> = ({
  label, content, isDefaultOpen: defaultOpen = false, className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [stateIndicator, setStateIndicator] = useState<number>(defaultOpen ? 180 : 0);
  const headerRef = useRef(null);
  const onClick = () => {
    if (isOpen) {
      setStateIndicator(0);
    } else {
      setStateIndicator(180);
    }
    setIsOpen(!isOpen);
  };

  useEventListener('click', onClick, headerRef);
  return (
    <div className={`accordian ${className}`}>
      <div className="accordian__header" ref={headerRef}>
        <p className="accordian__label">{label}</p>
        <p className="accordian__state-indicator" style={{ transform: `rotate(${stateIndicator}deg)` }}>V</p>
      </div>
      <div className={`accordian__content ${isOpen ? 'accordian__content--is-open' : ''}`}>
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
    </div>
  );
};

export default Accordian;
