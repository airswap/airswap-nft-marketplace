import { useAppSelector } from '../redux/hooks';

const useCollectionName = (): string => {
  const { config, metadata } = useAppSelector(state => state);
  const isLoading = metadata.collectionName === undefined;

  if (config.collectionName) {
    return config.collectionName;
  }

  if (isLoading) {
    return '';
  }

  return metadata.collectionName || 'Unknown';
};

export default useCollectionName;
