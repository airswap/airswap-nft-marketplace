import { useAppSelector } from '../redux/hooks';

const useCollectionImage = (): { bannerImage: string; } => {
  const { bannerImage } = useAppSelector(state => state.metadata);
  const { collectionImage } = useAppSelector(state => state.config);

  return {
    bannerImage: collectionImage || bannerImage || '',
  };
};

export default useCollectionImage;
