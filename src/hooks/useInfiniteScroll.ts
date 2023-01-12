import { useEffect, useState } from 'react';

type UseInfiniteScrollProps = {
  fetchCallback: () => Promise<void>;
}

type UseInfiniteScrollReturn = {
  isLoading: boolean;
}

const useInfiniteScroll = ({ fetchCallback }: UseInfiniteScrollProps): UseInfiniteScrollReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleScroll = async () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;

    /* Fetch more items */
    setIsLoading(true);
    await fetchCallback();
    setIsLoading(false);
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
