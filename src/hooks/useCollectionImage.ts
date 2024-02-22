import { useAppSelector } from '../redux/hooks';

const useCollectionImage = (): { bannerImage: string; } => {
  const { bannerImage } = useAppSelector(state => state.metadata);
  const { collectionImage } = useAppSelector(state => state.config);
  const isLoading = bannerImage === undefined;
  const fallbackImage = '/collection/market-night-scene.png';

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
