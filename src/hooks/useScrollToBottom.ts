import { useEffect, useState } from 'react';

const useScrollToBottom = (): boolean => {
  const [scrolledToBottom, setIsScrolledToBottom] = useState(false);

  const handleScroll = async () => {
    const { scrollTop } = document.documentElement;
    const { scrollHeight } = document.documentElement;
    const { clientHeight } = document.documentElement;

    setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrolledToBottom;
};

export default useScrollToBottom;
