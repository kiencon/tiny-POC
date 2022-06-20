import React, { useCallback, useEffect, useState } from 'react';
import Gallery from 'react-photo-gallery';
import styled from 'styled-components';
import { gcd, isSafariBrowser } from '../utils/func';
import ImageCarousel from './carousel/ImageCarousel';

const ImageGrid = ({ informationImage, fallback }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isShowCarouselModal, setShowCarouselModal] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const newImages = [];

    const pushToImages = image => {
      const width = image.metadata.width || 1;
      const height = image.metadata.height || 1;
      const ucln = gcd(width, height);
      newImages.push({
        src: image.url,
        width: width / ucln,
        height: height / ucln,
        label: decodeURIComponent(image.label),
        alt: 'Only support .png, .jpg, .jpeg',
      });
    };

    if (isSafariBrowser()) {
      informationImage.map(image => {
        if (!image.metadata) {
          return;
        }
        if (image.metadata && !image.metadata.url) {
          pushToImages(image);
          return;
        }
        if (!image.metadata.typeThumbnail) {
          pushToImages(image);
        }
      });
    } else {
      informationImage.map(image => {
        if (!image.metadata) {
          return;
        }
        if (image.metadata && !image.metadata.url) {
          pushToImages(image);
          return;
        }
        pushToImages({
          ...image,
          url: image.metadata.url,
          label: image.metadata.label || image.label,
        });
      });
    }
    setImages(newImages);
  }, [informationImage]);

  const handleOpenCarouselModal = useCallback((event, { index }) => {
    setCurrentImage(index);
    setShowCarouselModal(true);
  }, []);

  if (!Array.isArray(images) || images.length < 1) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return null;
  }

  return (
    <Wrap>
      <Gallery
        photos={images}
        columns={3}
        direction="column"
        onClick={handleOpenCarouselModal}
        margin={1}
      />
      <ImageCarousel
        images={images}
        currentImage={currentImage}
        isShowCarouselModal={isShowCarouselModal}
        setShowCarouselModal={setShowCarouselModal}
      />
    </Wrap>
  );
};

const Wrap = styled.section`
  div > div > img {
    border-radius: 4px;
    margin: 0!important;
  }
`;

export default ImageGrid;
