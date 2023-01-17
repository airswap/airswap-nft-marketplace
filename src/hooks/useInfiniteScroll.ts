import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollProps {
  fetchCallback: () => Promise<void>;
}

interface UseInfiniteScrollReturn {
  isLoading: boolean;
}

const useInfiniteScroll = ({ fetchCallback }: UseInfiniteScrollProps): UseInfiniteScrollReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /* 'fetchCallback' is an async function and it can be triggered multiple times.
  To avoid fetching the same data, this lock is used. */
  const lock = useRef<boolean>(false);

  const handleScroll = async () => {
    if (lock.current) return;

    const { scrollTop } = document.documentElement;
    const { scrollHeight } = document.documentElement;
    const { clientHeight } = document.documentElement;
    if (scrollTop + clientHeight < scrollHeight) return;

    /* Fetch more items */
    lock.current = true;
    setIsLoading(true);
    await fetchCallback();
    setIsLoading(false);
    lock.current = false;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    isLoading,
  };
};

export default useInfiniteScroll;
