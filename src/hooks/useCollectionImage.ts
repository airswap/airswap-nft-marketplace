import { useAppSelector } from '../redux/hooks';

const useCollectionImage = (): { bannerImage: string; } => {
  const { bannerImage } = useAppSelector(state => state.metadata);
  const { collectionImage } = useAppSelector(state => state.config);
  const isLoading = bannerImage === undefined;
  const fallbackImage = './collection/airswap-default-marketplace-cover.jpg';

  if (collectionImage) {
    return {
      bannerImage: collectionImage,
    };
  }

  if (isLoading) {
    return {
      bannerImage: '',
    };
  }

  return {
    bannerImage: bannerImage || fallbackImage,
  };
};

export default useCollectionImage;
