import React, { useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core';
import styled from 'styled-components';

const loadImageCarouselCss = () => import('./imageCarousel.css');

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101426b3',
    padding: '24px 40px',
    [theme.breakpoints.between('xs', 'sm')]: {
      padding: '24px 16px',
    },
    '& div:first-child': {
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '710px',
      backgroundColor: 'transparent!important',
      marginBottom: '24px',
      [theme.breakpoints.between('xs', 'sm')]: {
        marginBottom: '24px',
      },
      [theme.breakpoints.between('lg', 'xl')]: {
        maxHeight: '580px',
      },
    },
  },
  closeIcon: {
    color: '#ffffff',
    width: '24px',
  },
  reverseArrowIcon: {
    transform: 'rotate(180deg)',
  },
  arrowIcon: {
    color: '#222b45',
    fontSize: '12px',
  },
}));

const ImageCarousel = ({
  images,
  currentImage,
  isShowCarouselModal,
  setShowCarouselModal,
}) => {
  const classes = useStyles();

  useEffect(() => {
    loadImageCarouselCss();
  }, []);

  return (
    <>
      <Modal
        className={`${classes.modal} image-carousel`}
        open={isShowCarouselModal}
        onClose={() => setShowCarouselModal(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Carousel
          autoFocus
          selectedItem={currentImage}
          showStatus={false}
          showIndicators={false}
          useKeyboardArrows
          thumbWidth={93}
          autoPlay={false}
        >
          {images.length && images.map(img => (
            <div key={img.src}>
              <img src={img.src} alt={img.label} width={85} height={65} />
            </div>
          ))}
        </Carousel>
      </Modal>
      {isShowCarouselModal && (
        <WrapClose onClick={() => setShowCarouselModal(false)}>
          <CloseIcon className={classes.closeIcon} />
        </WrapClose>
      )}
    </>
  );
};

const WrapClose = styled.div`
  position: fixed;
  top: 32px;
  right: 36px;
  z-index: 1301;
  cursor: pointer;
`;

export default ImageCarousel;
