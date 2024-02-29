import React, {
  CSSProperties,
  FC,
  ReactElement,
  useRef,
} from 'react';

import './NftMedia.scss';

interface NftCardMediaProps {
  alt: string;
  autoPlay?: boolean;
  controls?: boolean;
  playOnHover?: boolean;
  id: string;
  image?: string;
  video?: string;
  className?: string;
}

const NftMedia: FC<NftCardMediaProps> = ({
  alt,
  autoPlay = false,
  controls = false,
  playOnHover = false,
  id,
  image,
  video,
  className = '',
}): ReactElement => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const cssProperties: CSSProperties = {
    viewTransitionName: `nft-image-${id}`,
  };

  const handleVideoMouseEnter = () => {
    if (videoRef.current && playOnHover) {
      videoRef.current.play();
    }
  };

  const handleVideoMouseLeave = () => {
    if (videoRef.current && playOnHover) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      style={cssProperties}
      className={`nft-media ${className}`}
    >
      {video ? (
        <video
          autoPlay={autoPlay}
          controls={controls}
          muted
          ref={videoRef}
          onMouseEnter={handleVideoMouseEnter}
          onMouseLeave={handleVideoMouseLeave}
          className="nft-media__video"
        >
          <source src={video} />
        </video>
        ) : (
          <img
            src={image}
            alt={alt}
            className="nft-media__img"
          />
      )}
    </div>
  );
};

export default NftMedia;
