import { useEffect, useState } from 'react';

const useFullOrderExpired = (orderExpiry: string): boolean => {
  const expiry = +orderExpiry * 1000;

  const [isExpired, setIsExpired] = useState(new Date().getTime() > expiry);

  useEffect((): () => void => {
    const timer = setInterval(() => {
      setIsExpired(new Date().getTime() > expiry);
    }, 1000);

    return () => clearInterval(timer);
  }, [orderExpiry]);

  return isExpired;
};

export default useFullOrderExpired;
